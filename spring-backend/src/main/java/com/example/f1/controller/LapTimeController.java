package com.example.f1.controller;

import com.example.f1.model.LapTime;
import com.example.f1.repo.LapTimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/laps")
@CrossOrigin(origins = "*")
public class LapTimeController {

    @Autowired
    private LapTimeRepository repo;

    // 1️⃣ Get all laps for a driver
    @GetMapping("/driver")
    public List<LapTime> getDriverLaps(
            @RequestParam int year,
            @RequestParam String gp,
            @RequestParam String session,
            @RequestParam String driver) {

        List<LapTime> raw = repo.findDriverLaps(
                year,
                gp,
                session,
                driver,
                Sort.by(Sort.Direction.ASC, "lapNumber")
        );

        return raw.stream()
                .filter(LapTime::isValid)
                .collect(Collectors.toList());
    }

    // 2️⃣ Fastest lap for each driver
    @GetMapping("/fastest")
    public Map<String, LapTime> getFastestLapsForAllDrivers(
            @RequestParam int year,
            @RequestParam String gp,
            @RequestParam String session) {

        List<LapTime> laps = repo.findByYearGPAndSession(year, gp, session);

        laps = laps.stream()
                .filter(LapTime::isValid)
                .collect(Collectors.toList());

        Set<String> drivers = laps.stream()
                .map(LapTime::getDriverCode)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Map<String, LapTime> result = new HashMap<>();

        for (String code : drivers) {
            List<LapTime> fastest = repo.findFastestLapForDriver(
                    year,
                    gp,
                    session,
                    code,
                    Sort.by(Sort.Direction.ASC, "lapTime_seconds")
            );

            LapTime validFastest = fastest.stream()
                    .filter(Objects::nonNull)
                    .filter(LapTime::isValid)
                    .findFirst()
                    .orElse(null);

            if (validFastest != null) {
                result.put(code, validFastest);
            }
        }

        return result;
    }

    // 3️⃣ Delete by GP + Year
    @DeleteMapping("/laps")
    public ResponseEntity<String> deleteLapsByGpAndYear(
            @RequestParam String gp,
            @RequestParam int year) {

        long deletedCount = repo.deleteByGrandPrixAndYear(gp, year);
        return ResponseEntity.ok("Deleted " + deletedCount + " records for " + gp + " " + year);
    }
}
