package com.mikey.shredhub.domain;

public class BattleRound {
	
	private BattleShred battleesShred;
	private BattleShred battlersShred;
	public BattleShred getBattleesShred() {
		return battleesShred;
	}
	public void setBattleesShred(BattleShred battleesShred) {
		this.battleesShred = battleesShred;
	}
	public BattleShred getBattlersShred() {
		return battlersShred;
	}
	public void setBattlersShred(BattleShred battlersShred) {
		this.battlersShred = battlersShred;
	}
	@Override
	public String toString() {
		return "BattleRound [battleesShred=" + battleesShred
				+ ", battlersShred=" + battlersShred + "]";
	}
}
