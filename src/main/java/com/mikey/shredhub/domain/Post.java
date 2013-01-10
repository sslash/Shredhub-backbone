package com.mikey.shredhub.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Post {
	
	@Override
	public String toString() {
		return "Post [id=" + id + ", text=" + text + "]";
	}

	@Id
	private String id;
	
	private String text;

}
