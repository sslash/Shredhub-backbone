package com.mikey.shredhub;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.mikey.shredhub.domain.Battle;
import com.mikey.shredhub.domain.BattleRequest;
import com.mikey.shredhub.domain.Shred;
import com.mikey.shredhub.domain.Shredder;



@RunWith(SpringJUnit4ClassRunner.class)
//ApplicationContext will be loaded from "classpath:/app-config.xml"
@ContextConfiguration(locations={"/mongo-config.xml"})
public class MongoTest {
	
	@Autowired
	MongoTemplate mongoTemplate;
	
	
	@Test
	public void test() {
		Assert.assertTrue(true);
	}
	
	private List<ObjectId> getFaneesForShredder(ObjectId shredder) {

		List <String> fanees =  mongoTemplate.findOne(
				new Query(Criteria.where("_id").is(shredder)), Shredder.class,
				"shredders").getFanees();
		List <ObjectId> toRet = new ArrayList <ObjectId>();
		for ( String s : fanees ) {
			toRet.add(new ObjectId(s));
		}
		return toRet;
	}
	
	@Test
	public void testSap() {	
		Criteria crit = 
				new Criteria().orOperator(
						Criteria.where("battlee.$id").is(new ObjectId("50b613515b5d9368d1c01faa")),
						Criteria.where("battler.$id").is(new ObjectId("50b613515b5d9368d1c01faa")));
		
		List <Battle> returned =  mongoTemplate.find(
				new Query(crit),
				Battle.class, "battle");
		
		for ( Battle r : returned ) {
			System.out.println(r);
		}
	}
	
	//@Test
	public void testMongoGetAll() {
		List <Shredder> res = mongoTemplate.find(new Query().limit(20), Shredder.class,"shredders");
		
		System.out.println("res: ") ;
		for(Shredder s : res ) {
			System.out.println(s);
		}
		
		
		/*String shredderId = "509fd6f3f4806a301d2f2706";
		Shredder sh = mongoTemplate.findOne(new Query(Criteria.where("_id").is(
				new ObjectId(shredderId))), Shredder.class,"shredders");
		
		String shredderid2="509fd56cf4806a301d2efc16";
		
		Shredder sh2 = mongoTemplate.findOne(new Query(Criteria.where("_id").is(
				new ObjectId(shredderid2))), Shredder.class,"shredders");
	
		Shredder sh3 = mongoTemplate.findOne(new Query(Criteria.where("_id").is(
				new ObjectId("509fd56cf4806a301d2efc17"))), Shredder.class,"shredders");
	
		
		WriteResult updateFirst = mongoTemplate.updateFirst(
				new Query(Criteria.where("_id").is(new ObjectId("509fd6f3f4806a301d2f2706"))),
				new Update().push("fanees", sh2),"shredders" );
		WriteResult updateFirst2 = mongoTemplate.updateFirst(
				new Query(Criteria.where("_id").is(new ObjectId("509fd6f3f4806a301d2f2706"))),
				new Update().push("fanees", sh3),"shredders" );*/
		
	}
	


}
