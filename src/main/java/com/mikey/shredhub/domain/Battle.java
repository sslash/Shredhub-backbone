package com.mikey.shredhub.domain;

import java.util.Date;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
public class Battle {

	@Id
	private String id;
	private Date timeCreated;
	@DBRef
	private Shredder battler;
	@DBRef
	private Shredder battlee;
	private String battleStyle;
	private int round;
	private List <BattleRound> battleRounds;
	private Date lastBattleShred;
	
	
	
	public Date getLastBattleShred() {
		return lastBattleShred;
	}

	public void setLastBattleShred(Date lastBattleShred) {
		this.lastBattleShred = lastBattleShred;
	}

	public List<BattleRound> getBattleRounds() {
		return battleRounds;
	}

	public void setBattleRounds(List<BattleRound> battleRounds) {
		this.battleRounds = battleRounds;
	}

	public String getBattleStyle() {
		return battleStyle;
	}
	
	public void setBattleStyle(String battleStyle) {
		this.battleStyle = battleStyle;
	}
	
	public int getRound() {
		return round;
	}
	
	public void setRound(int round) {
		this.round = round;
	}
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Date getTimeCreated() {
		return timeCreated;
	}
	public void setTimeCreated(Date timeCreated) {
		this.timeCreated = timeCreated;
	}
	public Shredder getBattler() {
		return battler;
	}
	public void setBattler(Shredder battler) {
		this.battler = battler;
	}
	public Shredder getBattlee() {
		return battlee;
	}
	public void setBattlee(Shredder battlee) {
		this.battlee = battlee;
	}

	@Override
	public String toString() {
		return "Battle [id=" + id + ", timeCreated=" + timeCreated
				+ ", battler=" + battler + ", battlee=" + battlee
				+ ", battleStyle=" + battleStyle + ", round=" + round
				+ ", battleRounds=" + battleRounds + "]";
	}

	
	
}
