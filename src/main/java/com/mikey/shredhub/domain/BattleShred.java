package com.mikey.shredhub.domain;

import java.util.Date;
import java.util.List;

/**
 * I could have created a superclass that inherits from a shred class, but I don't bother
 * 
 * @author michaekg
 *
 */
public class BattleShred {
	
	private ShredRating rating;
	private Date timeCreated;
	private String videoPath;
	private String videoThumbnail;
	private List <ShredComment> shredComments;
	
	
	public List<ShredComment> getShredComments() {
		return shredComments;
	}
	public void setShredComments(List<ShredComment> shredComments) {
		this.shredComments = shredComments;
	}
	public ShredRating getRating() {
		return rating;
	}
	public void setRating(ShredRating rating) {
		this.rating = rating;
	}
	public Date getTimeCreated() {
		return timeCreated;
	}
	public void setTimeCreated(Date timeCreated) {
		this.timeCreated = timeCreated;
	}
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
	@Override
	public String toString() {
		return "BattleShred [rating=" + rating + ", timeCreated=" + timeCreated
				+ ", videoPath=" + videoPath + ", videoThumbnail="
				+ videoThumbnail + "]";
	}
	
	
}
