package com.mikey.shredhub.repository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.bson.types.ObjectId;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Order;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Repository;

import com.mikey.shredhub.domain.Battle;
import com.mikey.shredhub.domain.BattleRequest;
import com.mikey.shredhub.domain.Shred;
import com.mikey.shredhub.domain.ShredComment;
import com.mikey.shredhub.domain.Shredder;
import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.WriteResult;

@Repository
public class ShredRepository {

	private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory
			.getLogger(ShredRepository.class);

	@Autowired
	MongoTemplate mongoTemplate;

	private static final int NO_SHREDS_IN_RESULT_SET = 20;
	private static final int NO_SHREDDERS_IN_RESULT_SET = 20;
	private static final int NO_BATTLES_IN_RESULT = 20;
	private static final int SHREDS_IN_TOP_SHREDS = 9;

	public List<Shred> getAllShreds() {
		return (List<Shred>) mongoTemplate.getCollection("shred");
	}

	public List<Shred> getShredsByQuery(String query, int page, String id) {
		if (query == null || query.isEmpty())
			return this.getShredsForShredder(id);
		else
			return mongoTemplate.find(new Query().limit(20), Shred.class,
					"shred");
	}

	public List<Shred> getShredsForShredder(String shredderId) {
		ObjectId shredder = new ObjectId(shredderId);

		// $id handles dbrefs!
		List<Shred> res = mongoTemplate.find(
				new Query(Criteria.where("owner.$id").is(shredder)),
				Shred.class, "shred");
		return res;
	}

	private List<Shred> getNShredsWithPageNumber(int page) {
		DBCollection coll = mongoTemplate.getCollection("shred");
		BasicDBObject query = new BasicDBObject(NO_SHREDS_IN_RESULT_SET);
		DBCursor res = coll.find(query);
		List<Shred> shreds = new ArrayList();
		while (res.hasNext()) {
			shreds.add((Shred) res.next());
		}
		return shreds;
	}

	/**
	 * Gets the user
	 * @param username
	 * @param password
	 * @return
	 */
	public Shredder getShredderByNameAndPassword(String username,
			String password) {
		Shredder s = mongoTemplate.findOne(
				new Query(Criteria.where("username").is(username)
						.and("password").is(password)), Shredder.class,
				"shredder");
		if ( s == null ) {
			logger.info("Error logging in, shredder was null!");
			return null;
		}
		
		// Get the fanees (As shredder objects, and add them to the shredder
		List<ObjectId> oid = objectToObjectId(s.getFanees());

		List<Shredder> shr = mongoTemplate.find(new Query(Criteria.where("_id")
				.in(oid)), Shredder.class, "shredder");
		
		s.setFanees(shr);
		return s;
	}

	public Shred updateShred(Shred shred) {
		logger.info("Will save: (NOT activated)" + shred.toString());
		// mongoTemplate.save(shred, "shreds");
		return shred;
	}

	public Shredder addFaneeForShredder(String shredderId, String faneeId) {
		Shredder fanee = mongoTemplate.findOne(new Query(Criteria.where("_id")
				.is(new ObjectId(faneeId))), Shredder.class, "shredder");

		WriteResult updateFirst = mongoTemplate.updateFirst(new Query(Criteria
				.where("_id").is(new ObjectId(shredderId))), new Update().push(
				"fanees", fanee), "shredder");

		// Fetch the shredder
		return mongoTemplate.findOne(
				new Query(Criteria.where("_id").is(new ObjectId(shredderId))),
				Shredder.class, "shredder");
	}

	public Shred addCommentToShred(ShredComment comment, String shredId) {

		WriteResult updateFirst = mongoTemplate.updateFirst(new Query(Criteria
				.where("_id").is(new ObjectId(shredId))), new Update().push(
				"shredComments", comment), "shred");

		return mongoTemplate.findOne(
				new Query(Criteria.where("_id").is(new ObjectId(shredId))),
				Shred.class, "shred");
	}

	// TODO: should be transactional
	public Shred addRatingToShred(int newRating, String shredId) {
		WriteResult updateFirst = mongoTemplate.updateFirst(new Query(Criteria
				.where("_id").is(new ObjectId(shredId))), new Update().inc(
				"shredRating.numberOfRaters", 1), "shred");

		WriteResult updateSecond = mongoTemplate.updateFirst(new Query(Criteria
				.where("_id").is(new ObjectId(shredId))), new Update().inc(
				"shredRating.currentRating", newRating), "shred");

		return mongoTemplate.findOne(
				new Query(Criteria.where("_id").is(new ObjectId(shredId))),
				Shred.class, "shred");
	}

	public Shredder getShredderById(String shredderId) {
		try{
		 return mongoTemplate.findOne(
				new Query(Criteria.where("_id").is(new ObjectId(shredderId))),
				Shredder.class, "shredder");
		} catch(Exception e){
			logger.error("Failed to get shredder with id : " + shredderId +
					e.getMessage());			
			return null;
		}
	}

	public void createShred(Shred s) {
		mongoTemplate.save(s, "shred");
	}

	public Shred getShredById(String id) {
		return mongoTemplate.findOne(
				new Query(Criteria.where("_id").is(new ObjectId(id))),
				Shred.class, "shred");
	}

	public List<Shredder> getShreddersByQuery(String query, int page, String id) {
		return mongoTemplate.find(
				new Query().limit(NO_SHREDDERS_IN_RESULT_SET), Shredder.class,
				"shredder");
	}

	public BattleRequest addBattleRequest(BattleRequest battleRequest) {
		mongoTemplate.insert(battleRequest, "battleRequest");
		return battleRequest;
	}

	public BattleRequest getBattleRequestById(String id) {
		return mongoTemplate.findOne(
				new Query(Criteria.where("_id").is(new ObjectId(id))),
				BattleRequest.class, "battleRequest");
	}

	public void saveBattleRequest(BattleRequest battleReq) {
		mongoTemplate.save(battleReq, "battleRequest");
	}

	public Battle getBattleForShredders(String battler1Id, String battler2Id) {
		Criteria battler1 = Criteria.where("battlee.$id")
				.is(new ObjectId(battler1Id)).and("battler.$id")
				.is(new ObjectId(battler2Id));
		Criteria battler2 = Criteria.where("battler.$id")
				.is(new ObjectId(battler1Id)).and("battlee.$id")
				.is(new ObjectId(battler2Id));

		List<Battle> res = mongoTemplate.find(
				new Query(new Criteria().orOperator(battler1, battler2)),
				Battle.class, "battle");

		if (!res.isEmpty())
			return res.get(0);
		else
			return null;
	}

	public BattleRequest getBattleRequestForShredders(String battler1Id,
			String battler2Id) {
		Criteria battler1 = Criteria.where("battlee.$id")
				.is(new ObjectId(battler1Id)).and("battler.$id")
				.is(new ObjectId(battler2Id));
		Criteria battler2 = Criteria.where("battler.$id")
				.is(new ObjectId(battler1Id)).and("battlee.$id")
				.is(new ObjectId(battler2Id));

		List<BattleRequest> res = mongoTemplate.find(
				new Query(new Criteria().orOperator(battler1, battler2)),
				BattleRequest.class, "battleRequest");

		if (!res.isEmpty())
			return res.get(0);
		else
			return null;
	}

	public Battle addBattle(Battle battle) {
		mongoTemplate.insert(battle, "battle");
		return battle;
	}

	public void deleteBattleRequest(String id) {
		mongoTemplate.remove(
				new Query(Criteria.where("_id").is(new ObjectId(id))),
				"battleRequest");
	}

	public Battle getBattleWithId(String id) {
		return mongoTemplate.findById(id, Battle.class, "battle");
	}

	public Battle updateBattle(Battle battle) {
		mongoTemplate.save(battle, "battle");
		return battle;
	}

	public List<Battle> getBattles(int page) {
		return mongoTemplate.find(new Query().limit(NO_BATTLES_IN_RESULT),
				Battle.class, "battle");
	}

	public Shredder updateShredder(Shredder shredder) {
		mongoTemplate.save(shredder, "shredder");
		return shredder;
	}

	public List<Shred> getShredsFromFanees(int page, String id) {

		Query q = Query.query(new Criteria().where("owner.$id").in(
				getFaneesForShredder(new ObjectId(id))));
		q.limit(NO_SHREDS_IN_RESULT_SET);
		q.sort().on("timeCreated", Order.DESCENDING);
		q.skip((page - 1) * 20);
		return mongoTemplate.find(q, Shred.class, "shred");
	}

	public List<Shred> getTopShreds(int page) {
		Query q = new Query().limit(SHREDS_IN_TOP_SHREDS);
		q.sort().on("shredRating.currentRating", Order.DESCENDING);
		q.skip((page - 1) * SHREDS_IN_TOP_SHREDS);
		return mongoTemplate.find(q, Shred.class, "shred");
	}

	private List<ObjectId> getFaneesForShredder(ObjectId shredder) {

		List<String> fanees = mongoTemplate.findOne(
				new Query(Criteria.where("_id").is(shredder)), Shredder.class,
				"shredder").getFanees();

		// This sux! But otherwise I'm not able to perform a query search
		List<ObjectId> toRet = new ArrayList<ObjectId>();
		for (String s : fanees) {
			toRet.add(new ObjectId(s));
		}
		return toRet;
	}

	public List<Shred> getShredsByTimeCreated(int page) {
		Query q = new Query();
		q.limit(NO_SHREDS_IN_RESULT_SET);
		q.sort().on("timeCreated", Order.DESCENDING);
		q.skip((page - 1) * NO_SHREDS_IN_RESULT_SET);
		return mongoTemplate.find(q, Shred.class, "shred");
	}

	public List<Shred> getShredsByTags(int page, String id, String[] tags) {
		if (tags != null) {
			Query q = Query.query(new Criteria().where("tags").in(tags));
			q.limit(NO_SHREDS_IN_RESULT_SET);
			q.sort().on("timeCreated", Order.DESCENDING);
			q.skip((page - 1) * NO_SHREDS_IN_RESULT_SET);

			return mongoTemplate.find(q, Shred.class, "shred");
		} else {
			return this.getShredsByTimeCreated(page);
		}
	}

	public List<Shred> getShredsYouMightKnow(int page, String id) {
		List<ObjectId> fanees = getFaneesForShredder(new ObjectId(id));
		List<ObjectId> faneesOfFanees = new ArrayList<ObjectId>();

		for (ObjectId fanee : fanees) {
			List<String> tempStringRes = new ArrayList<String>();
			tempStringRes.addAll( // Could call the function used above, but
									// saves some time using object id
					mongoTemplate.findOne(
							new Query(Criteria.where("_id").is(fanee)),
							Shredder.class, "shredder").getFanees());

			// Have to do the marshalling in order to perform the query below.
			// SUX!
			for (String s : tempStringRes) {
				faneesOfFanees.add(new ObjectId(s));
			}
		}

		Query q = Query.query(new Criteria().where("owner.$id").in(
				faneesOfFanees));
		q.limit(NO_SHREDS_IN_RESULT_SET);
		q.sort().on("timeCreated", Order.DESCENDING);
		q.skip((page - 1) * NO_SHREDS_IN_RESULT_SET);

		return mongoTemplate.find(q, Shred.class, "shred");
	}

	public List<Battle> getBattlesFromFanees(int page, String shredderId) {
		return this.getBattlesFromFanees(page, shredderId, "timeCreated",
				Order.DESCENDING);
	}

	private List<Battle> getBattlesFromFanees(int page, String shredderId,
			String sortParam, Order order) {
		ObjectId shredder = new ObjectId(shredderId);
		List<ObjectId> fanees = this.getFaneesForShredder(shredder);

		Criteria battler = Criteria.where("battler.$id").in(fanees);
		Criteria battlee = Criteria.where("battlee.$id").in(fanees);
		Criteria battleeNotShredder = Criteria.where("battlee.$id")
				.ne(shredder);
		Criteria battlerNotShredder = Criteria.where("battler.$id")
				.ne(shredder);

		Query q = new Query(
				new Criteria().andOperator(battleeNotShredder,
						battlerNotShredder,
						new Criteria().orOperator(battler, battlee)));
		q.sort().on(sortParam, order);
		q.limit(NO_BATTLES_IN_RESULT);

		return mongoTemplate.find(q, Battle.class, "battle");
	}

	public List<Battle> getBattleWithLatestBattleShredFromFanees(
			String shredderId) {
		return this.getBattlesFromFanees(1, shredderId, "lastBattleShred",
				Order.DESCENDING);
	}

	public List<Shredder> getShreddersYouMightLike(String shredderId,
			int numberOfResults) {
		ObjectId shredder = new ObjectId(shredderId);
		List<ObjectId> fanees = this.getFaneesForShredder(shredder);
		Shredder sh = mongoTemplate.findById(shredder, Shredder.class,
				"shredder");

		List<String> guitars = sh.getGuitars();
		List<String> equiptment = sh.getEquiptment();
		String country = sh.getCountry();

		Query query = new Query();
		query.addCriteria(new Criteria().andOperator(Criteria.where("guitars")
				.in(guitars), Criteria.where("equiptment").in(equiptment),
				Criteria.where("country").in(country), new Criteria()
						.nin(fanees)));
		query.limit(numberOfResults);

		List<Shredder> res = mongoTemplate.find(query, Shredder.class,
				"shredder");
		int resSize = res.size();
		logger.debug("Might dig shredders: " + resSize);

		if (resSize < numberOfResults) {
			query = new Query();
			query.addCriteria(new Criteria().andOperator(new Criteria()
					.orOperator(Criteria.where("guitars").in(guitars), Criteria
							.where("equiptment").in(equiptment), Criteria
							.where("country").in(country)), new Criteria()
					.nin(fanees)));
			query.limit(numberOfResults - resSize);
			res.addAll(mongoTemplate.find(query, Shredder.class, "shredder"));
		}

		return res;
	}

	private List<ObjectId> stringToObjectId(List<String> str) {
		List<ObjectId> oid = new ArrayList<ObjectId>();

		for (String s : str) {
			oid.add(new ObjectId(s));
		}

		return oid;
	}
	
	private List<ObjectId> objectToObjectId(List<Object> str) {
		List<ObjectId> oid = new ArrayList<ObjectId>();

		for (Object s : str) {
			oid.add(new ObjectId((String) s));
		}

		return oid;
	}

	public List<Shredder> getShreddersByIds(String[] shredderIds) {
		List<ObjectId> oid = stringToObjectId(Arrays.asList(shredderIds));

		List<Shredder> shr = mongoTemplate.find(new Query(Criteria.where("_id")
				.in(oid)), Shredder.class, "shredder");

		return shr;
	}

	public List<BattleRequest> getBattleRequestsForShredder(String id) {
		ObjectId shredder = new ObjectId(id);

		return mongoTemplate.find(
				new Query(Criteria.where("battlee.$id").is(shredder)),
				BattleRequest.class, "battleRequest");
	}

	public Shredder getShredderByUsername(String username) {
		try{
			 return mongoTemplate.findOne(
					new Query(Criteria.where("_id").is(new ObjectId(username))),
					Shredder.class, "shredder");
			} catch(Exception e){
				logger.error("Failed to get shredder with username : " + username +
						e.getMessage());			
				return null;
			}
	}

	public List<Battle> getBattlesForShredder(String shredderId) {
		Criteria crit = 
				new Criteria().orOperator(
						Criteria.where("battlee.$id").is(new ObjectId(shredderId)),
						Criteria.where("battler.$id").is(new ObjectId(shredderId)));
		
		return mongoTemplate.find(
				new Query(crit).limit(NO_BATTLES_IN_RESULT),
				Battle.class, "battle");	
	}
}
