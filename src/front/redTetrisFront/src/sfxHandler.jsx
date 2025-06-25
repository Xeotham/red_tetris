const   btbSounds = (sound) => {
	switch(sound) {
		case "btb_1": return new Audio("/src/assets/sfx/BejeweledSR/btb_1.ogg");
		case "btb_2": return new Audio("/src/assets/sfx/BejeweledSR/btb_2.ogg");
		case "btb_3": return new Audio("/src/assets/sfx/BejeweledSR/btb_3.ogg");
		case "btb_break": return new Audio("/src/assets/sfx/BejeweledSR/btb_break.ogg");
	}
}

const   clearSounds = (sound) => {
	switch(sound) {
		case "allclear": return new Audio("/src/assets/sfx/BejeweledSR/allclear.ogg");
		case "clearbtb": return new Audio("/src/assets/sfx/BejeweledSR/clearbtb.ogg");
		case "clearline": return new Audio("/src/assets/sfx/BejeweledSR/clearline.ogg");
		case "clearquad": return new Audio("/src/assets/sfx/BejeweledSR/clearquad.ogg");
		case "clearspin": return new Audio("/src/assets/sfx/BejeweledSR/clearspin.ogg");
	}
}

const   comboSounds = (sound) => {
	switch(sound) {
		case "combo_1": return new Audio("/src/assets/sfx/BejeweledSR/combo_1.ogg");
		case "combo_2": return new Audio("/src/assets/sfx/BejeweledSR/combo_2.ogg");
		case "combo_3": return new Audio("/src/assets/sfx/BejeweledSR/combo_3.ogg");
		case "combo_4": return new Audio("/src/assets/sfx/BejeweledSR/combo_4.ogg");
		case "combo_5": return new Audio("/src/assets/sfx/BejeweledSR/combo_5.ogg");
		case "combo_6": return new Audio("/src/assets/sfx/BejeweledSR/combo_6.ogg");
		case "combo_7": return new Audio("/src/assets/sfx/BejeweledSR/combo_7.ogg");
		case "combo_8": return new Audio("/src/assets/sfx/BejeweledSR/combo_8.ogg");
		case "combo_9": return new Audio("/src/assets/sfx/BejeweledSR/combo_9.ogg");
		case "combo_10": return new Audio("/src/assets/sfx/BejeweledSR/combo_10.ogg");
		case "combo_11": return new Audio("/src/assets/sfx/BejeweledSR/combo_11.ogg");
		case "combo_12": return new Audio("/src/assets/sfx/BejeweledSR/combo_12.ogg");
		case "combo_13": return new Audio("/src/assets/sfx/BejeweledSR/combo_13.ogg");
		case "combo_14": return new Audio("/src/assets/sfx/BejeweledSR/combo_14.ogg");
		case "combo_15": return new Audio("/src/assets/sfx/BejeweledSR/combo_15.ogg");
		case "combo_16": return new Audio("/src/assets/sfx/BejeweledSR/combo_16.ogg");
		case "combobreak": return new Audio("/src/assets/sfx/BejeweledSR/combobreak.ogg");
	}
}

const   garbageSounds = (sound) => {
	switch(sound) {
		case "counter": return new Audio("/src/assets/sfx/BejeweledSR/counter.ogg");
		case "damage_alert": return new Audio("/src/assets/sfx/BejeweledSR/damage_alert.ogg");
		case "damage_large": return new Audio("/src/assets/sfx/BejeweledSR/damage_large.ogg");
		case "damage_medium": return new Audio("/src/assets/sfx/BejeweledSR/damage_medium.ogg");
		case "damage_small": return new Audio("/src/assets/sfx/BejeweledSR/damage_small.ogg");
		case "garbage_in_large": return new Audio("/src/assets/sfx/BejeweledSR/garbage_in_large.ogg");
		case "garbage_in_medium": return new Audio("/src/assets/sfx/BejeweledSR/garbage_in_medium.ogg");
		case "garbage_in_small": return new Audio("/src/assets/sfx/BejeweledSR/garbage_in_small.ogg");
		case "garbage_out_large": return new Audio("/src/assets/sfx/BejeweledSR/garbage_out_large.ogg");
		case "garbage_out_medium": return new Audio("/src/assets/sfx/BejeweledSR/garbage_out_medium.ogg");
		case "garbage_out_small": return new Audio("/src/assets/sfx/BejeweledSR/garbage_out_small.ogg");
	}
}

const   userEffectSounds = (sound) => {
	switch(sound) {
		case "harddrop": return new Audio("/src/assets/sfx/BejeweledSR/harddrop.ogg");
		case "softdrop": return new Audio("/src/assets/sfx/BejeweledSR/softdrop.ogg");
		case "hold": return new Audio("/src/assets/sfx/BejeweledSR/hold.ogg");
		case "move": return new Audio("/src/assets/sfx/BejeweledSR/move.ogg");
		case "rotate": return new Audio("/src/assets/sfx/BejeweledSR/rotate.ogg");
	}
}

const   levelSounds = (sound) => {
	switch(sound) {
		case "level1": return new Audio("/src/assets/sfx/BejeweledSR/level1.ogg");
		case "level5": return new Audio("/src/assets/sfx/BejeweledSR/level5.ogg");
		case "level10": return new Audio("/src/assets/sfx/BejeweledSR/level10.ogg");
		case "level15": return new Audio("/src/assets/sfx/BejeweledSR/level15.ogg");
		case "levelup": return new Audio("/src/assets/sfx/BejeweledSR/levelup.ogg");
	}
}

const   lockSounds = (sound) => {
	switch(sound) {
		case "spinend": return new Audio("/src/assets/sfx/BejeweledSR/spinend.ogg");
		case "lock": return new Audio("/src/assets/sfx/BejeweledSR/lock.ogg");
	}
}

const   boardSounds = (sound) => {
	switch(sound) {
		case "floor": return new Audio("/src/assets/sfx/BejeweledSR/floor.ogg");
		case "sidehit": return new Audio("/src/assets/sfx/BejeweledSR/sidehit.ogg");
		case "topout": return new Audio("/src/assets/sfx/BejeweledSR/topout.ogg");
	}
}

export const    sfxPlayer = (type, sound) => {
	switch(type) {
		case "BTB":
			return btbSounds(sound);
		case "CLEAR":
			return clearSounds(sound);
		case "COMBO":
			return comboSounds(sound);
		case "GARBAGE":
			return garbageSounds(sound);
		case "USER_EFFECT":
			return userEffectSounds(sound);
		case "LEVEL":
			return levelSounds(sound);
		case "LOCK":
			return lockSounds(sound);
		case "SPIN":
			return new Audio("/src/assets/sfx/BejeweledSR/spin.ogg");
		case "BOARD":
			return boardSounds(sound);
	}
}