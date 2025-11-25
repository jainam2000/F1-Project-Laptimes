package com.example.f1.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "lap_times")
public class LapTime {
	 @Id
	 private String id;

	 private Integer year;

	 private String grandPrix;
	 private String session;

	 private String driver;

	 @Field("driver_code")
	 private String driverCode;

	 private Integer lapNumber;

	 @Field("lapTime_seconds")
	 private Double lapTimeSeconds;

	 private String lapTime_hms;
	 private String lapStartTime;
	 private String compound;

	 private Boolean is_fastest;

	 private Instant createdAt;

	 public boolean isValid() {
	     return lapTimeSeconds != null && !lapTimeSeconds.isNaN();
	 }

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Integer getYear() {
		return year;
	}

	public void setYear(Integer year) {
		this.year = year;
	}

	public String getGrandPrix() {
		return grandPrix;
	}

	public void setGrandPrix(String grandPrix) {
		this.grandPrix = grandPrix;
	}

	public String getSession() {
		return session;
	}

	public void setSession(String session) {
		this.session = session;
	}

	public String getDriver() {
		return driver;
	}

	public void setDriver(String driver) {
		this.driver = driver;
	}

	public String getDriverCode() {
		return driverCode;
	}

	public void setDriverCode(String driverCode) {
		this.driverCode = driverCode;
	}

	public Integer getLapNumber() {
		return lapNumber;
	}

	public void setLapNumber(Integer lapNumber) {
		this.lapNumber = lapNumber;
	}

	public Double getLapTimeSeconds() {
		return lapTimeSeconds;
	}

	public void setLapTimeSeconds(Double lapTimeSeconds) {
		this.lapTimeSeconds = lapTimeSeconds;
	}

	public String getLapTime_hms() {
		return lapTime_hms;
	}

	public void setLapTime_hms(String lapTime_hms) {
		this.lapTime_hms = lapTime_hms;
	}

	public String getLapStartTime() {
		return lapStartTime;
	}

	public void setLapStartTime(String lapStartTime) {
		this.lapStartTime = lapStartTime;
	}

	public String getCompound() {
		return compound;
	}

	public void setCompound(String compound) {
		this.compound = compound;
	}

	public Boolean getIs_fastest() {
		return is_fastest;
	}

	public void setIs_fastest(Boolean is_fastest) {
		this.is_fastest = is_fastest;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}
	 
}

//import lombok.Data;
//import org.springframework.data.annotation.Id;
//import org.springframework.data.mongodb.core.mapping.Document;
//
//@Data
//@Document(collection = "lap_times")
//public class LapTime {
//
//    @Id
//    private String id;
//
//    private int year;
//    private String grandPrix;
//    private String session;
//
//    private String driver;
//    private String driver_code;
//    private int lapNumber;
//
//    private Double lapTime_seconds;
//    private String lapTime_hms;
//
//    private String lapStartTime;
//    private String compound;
//
//    private boolean is_fastest;
//
//    private String createdAt;
//}

