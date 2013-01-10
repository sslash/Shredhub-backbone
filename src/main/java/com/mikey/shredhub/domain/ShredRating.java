package com.mikey.shredhub.domain;


public class ShredRating {
	
	private int currentRating;
	
	private int numberOfRaters;

	public int getCurrentRating() {
		return currentRating;
	}

	public void setCurrentRating(int currentRating) {
		this.currentRating = currentRating;
	}

	public int getNumberOfRaters() {
		return numberOfRaters;
	}

	public void setNumberOfRaters(int numberOfRaters) {
		this.numberOfRaters = numberOfRaters;
	}

	@Override
	public String toString() {
		return "ShredRating [currentRating=" + currentRating
				+ ", numberOfRaters=" + numberOfRaters + "]";
	}

	
}
