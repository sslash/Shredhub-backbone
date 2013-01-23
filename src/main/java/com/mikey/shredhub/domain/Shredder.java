package com.mikey.shredhub.domain;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.mongodb.DBObject;


@Document
public class Shredder{
	
	@Id
    private String id;
	
     private String profileImagePath;
     
     private String username;
     
     private String email;
     
     private String password;
     
     private Date birthdate;
          
     private String country;
     
     private List <String> guitars;
     
     private List <String> equiptment; 
          
     private String description;
     
     private Date timeCreated;
     
     private int shredderLevel;    
     
     /*
      * Fanees are stored as String id's, because:
      * If I use ObjectID, then the spring controllers wont be able to
      * understand the marshalling done by the web browser (somehow). 
      * Therefore, I wouldn't be able to send a shredder object from browser
      * to server because the fanees list wouldn't be understood.
      * When I use strings the controllers has no issue in understanding this (of course),
      * but when I perform mongo searches for shreds from fanees, I have to 
      * iterate though the fanees list and transform each string to an object id
      * field, which adds another O(n) performance crap. This is so lame,
      * and I should TODO: find another sollution for this. 
      */
     private List fanees;
 	 

     public int getShredderLevel() {
		return shredderLevel;
	}


	public void setShredderLevel(int shredderLevel) {
		this.shredderLevel = shredderLevel;
	}

     
     
	public List getFanees() {
		return fanees;
	}


	public void setFanees(List fanees) {
		this.fanees = fanees;
	}


	public Shredder(String shredderId) {
		this.id = shredderId;
	}
	
	
	public Date getTimeCreated() {
		return timeCreated;
	}


	public void setTimeCreated(Date timeCreated) {
		this.timeCreated = timeCreated;
	}


	public Shredder() {
		
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String name) {
		this.username = name;
	}

	public String getProfileImagePath() {
		return profileImagePath;
	}

	public void setProfileImagePath(String profileImagePath) {
		this.profileImagePath = profileImagePath;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Date getBirthdate() {
		return birthdate;
	}

	public void setBirthdate(Date birthdate) {
		this.birthdate = birthdate;
	}
	

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public void setId(String id) {
		this.id = id;		
	}
	
	public String getId() {
		return id;
	}

	public List<String> getGuitars() {
		return guitars;
	}

	public void setGuitars(List<String> guitars) {
		this.guitars = guitars;
	}

	public List<String> getEquiptment() {
		return equiptment;
	}

	public void setEquiptment(List<String> equiptment) {
		this.equiptment = equiptment;
	}
	
	public void addGuitar(String guitar) {
		if (guitars == null){
			guitars = new ArrayList<String>();
		}
		
		guitars.add(guitar);
	}
	
	public void addEquiptment(String equiptment) {
		if (this.equiptment == null){
			this.equiptment= new ArrayList<String>();
		}
		
		this.equiptment.add(equiptment);
	}





	@Override
	public String toString() {
		return "Shredder [id=" + id + ", profileImagePath=" + profileImagePath
				+ ", username=" + username + ", email=" + email + ", password="
				+ password + ", birthdate=" + birthdate + ", country="
				+ country + ", guitars=" + guitars + ", equiptment="
				+ equiptment + ", description=" + description
				+ ", timeCreated=" + timeCreated + ", shredderLevel="
				+ shredderLevel + ", fanees=" + fanees + "]";
	}


	@Override
	// Simple id comparison
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Shredder other = (Shredder) obj;
		if (id != other.id)
			return false;
		return true;
	}

}
