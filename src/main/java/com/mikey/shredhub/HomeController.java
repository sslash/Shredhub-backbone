package com.mikey.shredhub;

import java.util.List;
import java.util.Locale;

import javax.servlet.ServletContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.mikey.shredhub.domain.Battle;
import com.mikey.shredhub.domain.BattleRequest;
import com.mikey.shredhub.domain.BattleRound;
import com.mikey.shredhub.domain.BattleShred;
import com.mikey.shredhub.domain.Shred;
import com.mikey.shredhub.domain.ShredComment;
import com.mikey.shredhub.domain.Shredder;
import com.mikey.shredhub.repository.ShredRepository;
import com.mikey.shredhub.web.helpers.ImageUploadException;
import com.mikey.shredhub.web.helpers.LocalImageFileSaver;
import com.mikey.shredhub.web.helpers.LoginForm;

/**
 * Handles requests for the application home page.
 */
@Controller
public class HomeController {

	@Autowired
	ShredRepository shredRepository;

	@Autowired
	private ServletContext servletContext;

	private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory
			.getLogger(HomeController.class);

	/**
	 * Simply selects the home view to render by returning its name.
	 */
	@RequestMapping(value = { "/", "" }, method = RequestMethod.GET)
	public String home() {
		logger.info("Home page requested!");
		return "home";
	}

	@RequestMapping(value = "/shreds/{id}", method = RequestMethod.PUT)
	public @ResponseBody
	Shred updateShred(@RequestBody Shred shred, @PathVariable String id) {
		logger.info("Update shred requested! id = " + id + " Shred = "
				+ shred.toString());
		// Persist shred!
		return shredRepository.updateShred(shred);
	}

	@RequestMapping(value = "/shredders/{shredderId}/fanees", method = RequestMethod.PUT)
	public @ResponseBody
	Shredder addFaneeToShredder(@PathVariable String shredderId,
			@RequestBody String faneeId) {
		logger.info("Add fanee requested! ShredderId = " + shredderId + ","
				+ "faneeId: " + faneeId);

		String faneeIdDecoded = faneeId.split("=")[1];
		return shredRepository.addFaneeForShredder(shredderId, faneeIdDecoded);
	}
	
	@RequestMapping(value = "shredders/", method = RequestMethod.GET,
			params="action=listOfShredders")
	public @ResponseBody List<Shredder> 
	getListOfShredders(@RequestParam String [] shredderIds) {
		logger.info("Get list of shredders requested! id size: " + shredderIds.length);

		return shredRepository.getShreddersByIds(shredderIds);
	}

	@RequestMapping(value = "/shreds/{id}", method = RequestMethod.GET)
	public @ResponseBody
	Shred getShred(@PathVariable String id) {
		logger.info("Get shred requested! Id: " + id);
		return shredRepository.getShredById(id);
	}
	
	@RequestMapping(value = "/shreds/shredder/{id}", method = RequestMethod.GET)
	public @ResponseBody
	List<Shred> getShredsByShredder(@PathVariable String id) {
		logger.info("Get shreds for shredder" + id);
		return shredRepository.getShredsForShredder(id);
	}

	@RequestMapping(value = "/shredders/{id}", method = RequestMethod.GET)
	public @ResponseBody
	Shredder getShredder(@PathVariable String id) {
		logger.info("Get shredder requested! Id: " + id);
		Shredder res = shredRepository.getShredderById(id);
		logger.info("will return: " + res);
		return res;
	}
	
	@RequestMapping(value = "/shredders/username/{username}", method = RequestMethod.GET)
	public @ResponseBody
	Shredder getShredderByUsername(@PathVariable String username) {
		logger.info("Get shredder by username requested! username: " + username);
		return shredRepository.getShredderByUsername(username);
	}

	@RequestMapping(value = "/shredders", method = RequestMethod.GET)
	public @ResponseBody
	List<Shredder> getShredders(@RequestParam("q") String query,
			@RequestParam("page") int page, @RequestParam("id") String id) {

		logger.info("Get shredders requested! q=" + query + ", page=" + page
				+ ", id=" + id);

		return shredRepository.getShreddersByQuery(query, page, id);
	}
	
	@RequestMapping(value = "/shredders", method = RequestMethod.GET, params = "action=mightKnowShredders")
	public @ResponseBody
	List<Shredder> getShreddersYouMightLike(
			@RequestParam("id") String shredderId,
			@RequestParam("resultNum") int resultNum) {

		logger.info("Get shredders you might know requested! id = " + shredderId + ", resNum: " + resultNum);

		return shredRepository.getShreddersYouMightLike(shredderId, resultNum);
	}

	@RequestMapping(value = "/shreds", method = RequestMethod.GET)
	public @ResponseBody
	List<Shred> getShreds(@RequestParam("q") String query,
			@RequestParam("page") int page, @RequestParam("id") String id) {

		logger.info("Get shreds requested! q=" + query + "page=" + page + "id="
				+ id);

		return shredRepository.getShredsByQuery(query, page, id);
	}

	@RequestMapping(value = "/shreds", method = RequestMethod.GET, params = "q=NewShredsFromFanees")
	public @ResponseBody
	List<Shred> getShredsFromFanees(@RequestParam("page") int page,
			@RequestParam("id") String id) {

		logger.info("Get shreds from fanees requested! page=" + page + "id="
				+ id);

		return shredRepository.getShredsFromFanees(page, id);
	}

	@RequestMapping(value = "/shreds", method = RequestMethod.GET, params = "q=TopShreds")
	public @ResponseBody
	List<Shred> getTopShreds(@RequestParam("page") int page,
			@RequestParam("id") String id) {

		if (page < 1)
			return null;

		logger.info("Get top shreds requested! page=" + page + "id=" + id);

		return shredRepository.getTopShreds(page);
	}

	@RequestMapping(value = "/shreds", method = RequestMethod.GET, params = "q=ShredsByTags")
	public @ResponseBody
	List<Shred> getShredsByTags(
			@RequestParam(value = "tag", required = false) String[] tags,
			@RequestParam("page") int page, @RequestParam("id") String id) {

		if (page < 1)
			return null;

		logger.info("Get shreds by tags requested! page=" + page + "id=" + id
				+ ", Tags:");
		if (tags != null) {
			for (String t : tags) {
				logger.info(t + ", ");
			}
		}

		return shredRepository.getShredsByTags(page, id, tags);
	}
	
	@RequestMapping(value = "/shreds", method = RequestMethod.GET, params = "q=ShredsYouMightKnow")
	public @ResponseBody
	List<Shred> getShredsMightKnow(
			@RequestParam("page") int page,
			@RequestParam("id") String id) {

		if (page < 1)
			return null;

		logger.info("Get shreds you might know requested! page=" + page + "id=" + id);

		return shredRepository.getShredsYouMightKnow(page, id);
	}

	@RequestMapping(value = { "/shreds/{shredderId}", "/shreds/{shredderId}" }, method = RequestMethod.GET)
	public @ResponseBody
	List<Shred> getShredsForShredder(@PathVariable String shredderId) {
		logger.info("Get shreds for shredder requested. shredder: "
				+ shredderId);
		return shredRepository.getShredsForShredder(shredderId);
	}

	@RequestMapping(value = "/shredders/{id}", method = RequestMethod.PUT)
	public @ResponseBody
	Shredder updateShredder(@PathVariable String id,
			@RequestBody Shredder shredder) {
		logger.info("Update shredder: " + id + ", shredder: " + shredder);
		return shredRepository.updateShredder(shredder);
	}

	@RequestMapping(value = { "/shreds/{shredId}/comments/",
			"/shreds/{shredId}/comments/" }, method = RequestMethod.POST)
	public @ResponseBody
	Shred addShredComment(@RequestBody ShredComment comment,
			@PathVariable String shredId) {
		logger.info("Add shred comment requested! comment: " + comment
				+ ", shredId: " + shredId);
		return shredRepository.addCommentToShred(comment, shredId);
	}

	@RequestMapping(value = { "/shreds/{shredId}/rating/{newRateVal}",
			"/shreds/{shredId}/rating/{newRateVal}/" }, method = RequestMethod.POST)
	public @ResponseBody
	Shred addRatingToShred(@PathVariable String shredId,
			@PathVariable int newRateVal) {
		logger.info("Add rating requested! shredId: " + shredId
				+ ", newRateVal: " + newRateVal);
		return shredRepository.addRatingToShred(newRateVal, shredId);
	}

	/**
	 * Logs in a user
	 */
	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public @ResponseBody
	Shredder login(@RequestBody LoginForm loginForm) {
		logger.info("Login requested!");

		return shredRepository.loginShredder(
				loginForm.getUsername(), loginForm.getPassword());
	}
	
	@RequestMapping (value = {"shreds", "shreds/"}, method = RequestMethod.POST)
	public @ResponseBody Shred postShred(@RequestBody Shred shred) {
		logger.info("Add shred requested! Shred : " + shred );
		shredRepository.createShred(shred);
		return shred;
	}

	// TODO: Create a factory method for creating shreds
	@RequestMapping(value = "shreds/{id}", method = RequestMethod.POST)
	public @ResponseBody
	Shred updateShred(@RequestParam("file") MultipartFile file,
			@PathVariable String id) throws Exception {

		logger.info("Add shred requested! FIle: " + file.getContentType()
				+ ", " + file.getOriginalFilename() + ", " + file.getName());

		Shred s = shredRepository.getShredById(id);

		String fileName = s.getOwner().getId() + "_" + file.getOriginalFilename();
		String thumbname = fileName.split("\\.")[0] + ".jpg"; // TODO: clean up
		s.setVideoThumbnail(thumbname);
		s.setVideoPath(fileName);
		String deployPath = servletContext.getRealPath("/") + "resources/vidz/";
		new LocalImageFileSaver(deployPath).saveFile(file, fileName);
		logger.info("will save this shred");
		shredRepository.createShred(s);

		return s;
	}

	/**
	 * Has to be post, or else it doesn't work...
	 * 
	 * @param file
	 * @param id
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value = "battleRequests/{id}", method = RequestMethod.POST)
	public @ResponseBody
	BattleRequest updateBattleRequestWithVideo(
			@RequestParam("file") MultipartFile file, @PathVariable String id)
			throws Exception {

		logger.info("Will store battle request video! : "
				+ file.getContentType() + ", " + file.getOriginalFilename()
				+ ", " + file.getName() + ", " + file.getSize() + " ,Id = "
				+ id);
		BattleRequest battleReq = shredRepository.getBattleRequestById(id);
		System.out.println("Got battle requst : " + battleReq);
		
		
		String fileName = "battle_" + id + "_" + file.getOriginalFilename();
		String thumbname = fileName.split("\\.")[0] + ".jpg"; // TODO: clean up
		battleReq.setVideoThumbnail(thumbname);
		battleReq.setVideoPath(fileName);
		String deployPath = servletContext.getRealPath("/") + "resources/vidz/";
		new LocalImageFileSaver(deployPath).saveFile(file, fileName);
		shredRepository.saveBattleRequest(battleReq);
		return battleReq;
	}

	@RequestMapping(value = { "battleRequests", "battleRequests/" }, method = RequestMethod.POST)
	public @ResponseBody
	BattleRequest addBattleRequest(@RequestBody BattleRequest battleRequest)
			throws Exception {

		logger.info("Post Battle request! :" + battleRequest.toString());
		battleRequest = shredRepository.addBattleRequest(battleRequest);
		
		logger.info("1: battle req: " + battleRequest.getId());
		
		BattleRequest battleReq = shredRepository.getBattleRequestById(battleRequest.getId());
		System.out.println("Battle request after first post: " + battleReq);
		return battleRequest;
	}

	@RequestMapping(value = { "battleRequests", "battleRequests/" }, method = RequestMethod.GET)
	public @ResponseBody
	BattleRequest getBattleRequestForShredders(
			@RequestParam("shredder1") String shredder1Id,
			@RequestParam("shredder2") String shredder2Id) throws Exception {

		logger.info("Battle request for shredders:! : " + shredder1Id + ", "
				+ shredder2Id);
		return shredRepository.getBattleRequestForShredders(shredder1Id,
				shredder2Id);
	}
	
	@RequestMapping(value = "battleRequests/shredder/{id}", method = RequestMethod.GET)
	public @ResponseBody
	List<BattleRequest> getBattleRequestsForShredder(
			@PathVariable String id) throws Exception {

		logger.info("Battle request for shredder requested! id:" + id );
		return shredRepository.getBattleRequestsForShredder(id);
	}

	@RequestMapping(value = { "battles/", "battles" }, method = RequestMethod.GET)
	public @ResponseBody
	Battle getBattleForShredders(@RequestParam("shredder1") String shredder1Id,
			@RequestParam("shredder2") String shredder2Id) {
		logger.info("Get battle for two shredders requested!: " + shredder1Id
				+ ", " + shredder2Id);

		return shredRepository.getBattleForShredders(shredder1Id, shredder2Id);
	}
	
	@RequestMapping(value = "battles/shredder/{shredderId}", method = RequestMethod.GET)
	public @ResponseBody 
	List<Battle> getBattlesForShredder(@PathVariable String shredderId) {
		logger.info("Get battle for shredder requested!: " + shredderId);

		List <Battle> res = shredRepository.getBattlesForShredder(shredderId);
		logger.info("print: ");
		for ( Battle b : res) {
			logger.info(b.toString());
		}
		return res;
	}
	
	@RequestMapping(value = "battles/", method = RequestMethod.GET, 
			params = "action=withLatestBattleShredsFromFanees")
	public @ResponseBody
	List<Battle> getBattleByLatestBattleShredsFromFanees(@RequestParam("id") String shredderId ) {
		logger.info("Get battle from fanees by latest battle shred: " + shredderId);

		return shredRepository.getBattleWithLatestBattleShredFromFanees(shredderId);
	}

	
	@RequestMapping(value = { "battles/", "battles" }, method = RequestMethod.GET, params = "action=search")
	public @ResponseBody
	List<Battle> getBattles(@RequestParam("page") int page) {
		logger.info("Get battles requested!: page: " + page);

		return shredRepository.getBattles(page);
	}
	
	@RequestMapping(value="battles/", method = RequestMethod.GET, params = "action=fromFanees")
	public @ResponseBody
	List<Battle> getBattlesFromFanees(
			@RequestParam("page") int page,
			@RequestParam("shredderId") String id) {
		logger.info("Get battles from faneesrequested! page: " + page + ", id=" + id);

		return shredRepository.getBattlesFromFanees(page, id);
	}

	@RequestMapping(value = "battles/{id}", method = RequestMethod.GET)
	public @ResponseBody
	Battle getBattle(@PathVariable String id) {
		logger.info("Get battle with id requested! id: " + id);

		return shredRepository.getBattleWithId(id);
	}

	@RequestMapping(value = { "battles/", "battles" }, method = RequestMethod.POST)
	public @ResponseBody
	Battle addBattle(@RequestBody Battle battle) {
		logger.info("Add battle requested!: " + battle);

		return shredRepository.addBattle(battle);
	}

	@RequestMapping(value = "battles/{id}", method = RequestMethod.PUT)
	public @ResponseBody
	Battle updateBattle(@RequestBody Battle battle, @PathVariable String id) {
		logger.info("Update battle requested! Id : " + id + " , battle: " + battle);

		return shredRepository.updateBattle(battle);
	}

	@RequestMapping(value = { "battles/{id}", "battles/{id}" }, method = RequestMethod.POST, params = "action=addVideo")
	public @ResponseBody
	BattleShred addVideoToBattle(@PathVariable String id,
			@RequestParam("file") MultipartFile file,
			@RequestParam("nextUp") String nextUp) throws ImageUploadException {
		logger.info("Add battle requested! Id : " + id + ", file: "
				+ file.getContentType() + ", " + file.getOriginalFilename()
				+ ", " + file.getName() + ", " + file.getSize() + ", next up: " + nextUp); 

		// return shredRepository.addBattle(battle);
		Battle b = shredRepository.getBattleWithId(id);
		if (b == null)
			return null;

		List<BattleRound> battleRounds = b.getBattleRounds();
		BattleRound round = battleRounds.get(battleRounds.size() - 1);
		BattleShred battleShred;

		if (nextUp.equals("battleesShred")) {
			battleShred = round.getBattleesShred();
		} else if (nextUp.equals("battlersShred")) {
			battleShred = round.getBattlersShred();
		} else {
			return null;
		}

		String fileName = "battle_" + id + "_" + nextUp + "_"
				+ battleRounds.size() + file.getOriginalFilename();
		String thumbname = fileName.split("\\.")[0] + ".jpg"; // TODO: clean up
		battleShred.setVideoThumbnail(thumbname);
		battleShred.setVideoPath(fileName);
		String deployPath = servletContext.getRealPath("/") + "resources/vidz/";
		new LocalImageFileSaver(deployPath).saveFile(file, fileName);
		shredRepository.updateBattle(b);
		
		return battleShred;
	}

	@RequestMapping(value = "battleRequests/{id}", method = RequestMethod.DELETE)
	public void deleteBattleRequest(@PathVariable String id) {
		logger.info("Delete battleRequest requested!: " + id);

		shredRepository.deleteBattleRequest(id);
	}

}
