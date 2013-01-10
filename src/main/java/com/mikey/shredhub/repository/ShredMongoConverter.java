package com.mikey.shredhub.repository;

import java.util.Date;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.core.convert.converter.Converter;

import com.mikey.shredhub.domain.Shred;
import com.mikey.shredhub.domain.ShredComment;
import com.mikey.shredhub.domain.ShredRating;
import com.mikey.shredhub.domain.Shredder;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import com.mongodb.DBRef;

/**
 * NOT USED!
 * 
 * 
 * @author michaekg
 *
 */
public class ShredMongoConverter implements Converter <DBObject, Shred>{

	public Shred convert(DBObject source) {
		Shred s = new Shred();
		//s.setId((ObjectId) source.get("_id")); 
		s.setDescription((String) source.get("description"));
		
		Shredder sh = new Shredder();
		//sh.setId((ObjectId)((DBRef) source.get("owner")).getId()); 
		//s.setOwner(sh);
		s.setShredComments((List <ShredComment>) source.get("shredComments") );
		s.setShredType((String) source.get("shredType"));
		BasicDBObject obj = (BasicDBObject) source.get("shredRating");
		ShredRating rating = new ShredRating();
		rating.setCurrentRating( ((Double) obj.get("currentRating")).intValue() );
		rating.setNumberOfRaters( ((Double) obj.get("numberOfRaters")).intValue() );
		
		s.setOwner((Shredder) source.get("owner"));
	
		s.setShredRating(rating);
		s.setTags((List<String>) source.get("tags"));
		s.setTimeCreated((Date) source.get("timeCreated"));
		s.setVideoPath((String) source.get("videoPath"));
		s.setVideoThumbnail((String) source.get("videoThumbnail"));
		return s;		
	}	

}
