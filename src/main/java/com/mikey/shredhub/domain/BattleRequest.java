package com.mikey.shredhub.domain;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class BattleRequest {

	@Id
	private String id;
	
	@DBRef
	private Shredder battler;
	
	@DBRef
	private Shredder battlee;
	
	private String battleStyle;
	private Date timeCreated;	
	private String videoPath;
	private String videoThumbnail;	
	
	public String getVideoPath() {
		return videoPath;
	}
	public void setVideoPath(String videoPath) {
		this.videoPath = videoPath;
	}
	public String getVideoThumbnail() {
		return videoThumbnail;
	}
	public void setVideoThumbnail(String videoThumbnail) {
		this.videoThumbnail = videoThumbnail;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Shredder getBattler() {
		return battler;
	}
	public void setBattler(Shredder battler) {
		this.battler = battler;
	}
	public Shredder getBattlee() {
		return battlee;
	}
	public void setBattlee(Shredder battlee) {
		this.battlee = battlee;
	}
	public String getBattleStyle() {
		return battleStyle;
	}
	public void setBattleStyle(String battleStyle) {
		this.battleStyle = battleStyle;
	}
	public Date getTimeCreated() {
		return timeCreated;
	}
	public void setTimeCreated(Date timeCreated) {
		this.timeCreated = timeCreated;
	}
	
	@Override
	public String toString() {
		return "BattleRequest [battler=" + battler + ", battlee=" + battlee
				+ ", battleStyle=" + battleStyle + ", timeCreated="
				+ timeCreated + "]";
	}

}
