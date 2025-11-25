package com.example.f1.repo;

import com.example.f1.model.LapTime;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface LapTimeRepository extends MongoRepository<LapTime, String> {

    // Get laps by Year + GP + Session
    @Query("{ 'year': ?0, 'grandPrix': ?1, 'session': ?2 }")
    List<LapTime> findByYearGPAndSession(int year, String grandPrix, String session);

    // Get laps for driver by Year + GP + Session
    @Query("{ 'year': ?0, 'grandPrix': ?1, 'session': ?2, 'driver_code': ?3 }")
    List<LapTime> findDriverLaps(int year, String grandPrix, String session, String driverCode, Sort sort);

    // Fastest Lap query sorted ASC
    @Query("""
           { 'year': ?0, 'grandPrix': ?1, 'session': ?2, 'driver_code': ?3, 'lapTime_seconds': { $type: 1 } }
           """)
    List<LapTime> findFastestLapForDriver(int year, String gp, String session, String driverCode, Sort sort);

    long deleteByGrandPrixAndYear(String grandPrix, int year);
}
