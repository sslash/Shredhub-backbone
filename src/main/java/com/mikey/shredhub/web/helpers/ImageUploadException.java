package com.mikey.shredhub.web.helpers;

public class ImageUploadException extends Exception { 
	
	public ImageUploadException(String errorMessage) {
		super(errorMessage);
	}

	public ImageUploadException(String errorMessage, Exception e) {
		super(errorMessage, e);
	}
}
