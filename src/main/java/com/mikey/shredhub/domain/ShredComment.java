package com.mikey.shredhub.domain;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class ShredComment {

	//@Id
	//private String id;
	
	private Date timeCreated;
	
	private String text;
	
	private String commenterId; 
	
	private String commenterName;

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getCommenterId() {
		return commenterId;
	}

	public void setCommenterId(String commenter) {
		this.commenterId = commenter;
	}

	public Date getTimeCreated() {
		return timeCreated;
	}

	public void setTimeCreated(Date timeCreated) {
		this.timeCreated = timeCreated;
	}


	public String getCommenterName() {
		return commenterName;
	}

	public void setCommenterName(String commenterName) {
		this.commenterName = commenterName;
	}

	@Override
	public String toString() {
		return "ShredComment [timeCreated=" + timeCreated
				+ ", text=" + text + ", commenterId=" + commenterId + "]";
	}	
}
