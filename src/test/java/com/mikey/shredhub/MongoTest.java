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
				"shredder").getFanees();
		List <ObjectId> toRet = new ArrayList <ObjectId>();
		for ( String s : fanees ) {
			toRet.add(new ObjectId(s));
		}
		return toRet;
	}
	
	@Test
	public void testSap() {	
		ObjectId shredder = new ObjectId("50f7c4d74283292147f1b2a3");
		List<ObjectId> notInSet = this.getFaneesForShredder(shredder);
		Shredder sh = mongoTemplate.findById(shredder, Shredder.class,
				"shredder");
		notInSet.add(shredder);
		
		System.out.println("NOT IN SET: " );
		for( ObjectId ids : notInSet) {
			System.out.println(ids);
		}
		
		List <Shredder> fanees =  mongoTemplate.find(
				new Query(Criteria.where("_id").nin(notInSet)), Shredder.class,
				"shredder");
		System.out.println("These are not:");
		for ( Shredder s : fanees) {
			System.out.println(s.getId());
		}
		

		List<String> guitars = sh.getGuitars();
		List<String> equiptment = sh.getEquiptment();
		String country = sh.getCountry();

		Query query = new Query();
		Criteria ors = new Criteria().orOperator(
				Criteria.where("guitars")
				.in(guitars), Criteria.where("equiptment").in(equiptment),
				Criteria.where("country").in(country));
		
		query.addCriteria(new Criteria().andOperator(ors, Criteria.where("_id").nin(notInSet)));
		//query.limit(numberOfResults);

		List<Shredder> res = mongoTemplate.find(query, Shredder.class,
				"shredder");
		int resSize = res.size();
		System.out.println("FINAL RES: " + resSize);
	//	logger.info("Might dig shredders: " + resSize);
		for ( Shredder sr : res) {
			System.out.println(sr.toString());
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
