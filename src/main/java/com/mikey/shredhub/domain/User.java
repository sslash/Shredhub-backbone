package com.mikey.shredhub.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class User {

	@Id
	private String id;
	
	private String name;
	
	@DBRef
	private Post post;

	@Override
	public String toString() {
		return "User [id=" + id + ", name=" + name + ", post=" + post + "]";
	}
}
