function idleClassAutocrat() {    
	// The Idle Class Autocrat
	// made with luv by argembarger
	// v1.3.3, made for The Idle Class v0.4.3
	// USE AT OWN RISK -- feel free to steal
	// not responsible if your game gets hurt >_>
	// Export Early / Export Often
	// There are options! Skim through the code to see ‘em
	// See the very bottom of this script for the actual loop function.
	//
	// Instructions: just copy this entire text file (ctrl-a, ctrl-c)
	// and paste it (ctrl-v) into the console, and hit enter to submit
	// (Use F12 to access developer console on most browsers)
	// Only paste once! Unless you're a cheater :D
	//
	// FUN MANUAL ALTERNATIVE (for Chrome and JS-edit-capable browsers):
	// Placing in function mainClick() { } as a replacement for game.addManualClicks();
	// This makes each click of "Earn Dollars" check/update everything
	// Makes the game a fully-automated clicker XD
	//
	// IMPORTANT NOTES:
	// You have to re-inject this code on every refresh.
	// I have observed page-cache-wrecking errors on occasion, not sure if it's this script or just me messing around while making it.
	// I recommend exporting your save and refreshing the page before declaring bankruptcy.
	// Clearing the page's cache data through the browser can restore function if your save file gets corrupted and it fails to load.

	// Money Clicker
	game.addManualClicks();
    
	// Auto Upgrade
	// You can use this line if you like buying upgrades immediately
	// game.buyAllUpgrades();
	// You can use this for-loop if you like only spending certain percentages of your money
	// Default is 10%
	var currUpgrade;
	for(var i = 0; i < game.availableUpgrades().length; i++) {
		currUpgrade = game.availableUpgrades()[i];
		if(currUpgrade.price.val() < (game.currentCash.val() * 0.1)) {
		    currUpgrade.buy();
		}
	}
    
	// Employee Autobuyer
	// Based on currently-selected Purchase Rate.
	var currEmployee;
	for(var i = 0; i <= 11; i++) {
		currEmployee = game.units.peek(0)[i];
		// 10%-limited employee-hiring
		if(currEmployee.price.val() < (game.currentCash.val() * 0.1)) {
		    currEmployee.buy();
		}
	}
    
	// Auto Email Reply
	var autoBusinessWords = ['synergy', 'downsize', 'bandwidth', 'stakeholders', 'shareolders', 'clients', 'customers', 'profits', 'ROI', 'ideate', 'ideation', 'globalization', 'evergreen', 'disruptive', 'disrupt', 'innovation', 'innovate', 'dynamism', 'millennial', 'holistic', 'paradigm', 'wheelhouse', 'B2B', 'B2C', 'analytics', 'brand', 'branding', 'hyperlocal', 'optimization', 'client', 'customer', 'profit', 'outsourcing', 'outsource', 'startup', 'marketing', 'sales', 'agile', 'mission', 'executive', 'stocks', 'investments', 'investment', 'shares', 'valuation',  'investment', 'shareholders', 'BYOD', 'advertainment', 'marketing', 'deliverable', 'actionable', 'hacking', 'KPI', 'pivot', 'leverage', 'startup', 'downsizing', 'outsourcing', 'unicorn', 'SEO', 'wunderkind', 'market', 'EBITDA', 'ASAP', 'EOD', 'actionable', 'action', 'influencer', 'CTR', 'gamified', 'gamification', 'revenue', 'overhead'];
	var currInbox = game.mail();
	var currMail;
	for(var i = currInbox.length - 1; i >= 0; i--) {
		currMail = currInbox[i];
		// EMAIL CHEAT: You can uncomment the following line to exploit emails
		if(currMail.replied() == true) { continue; }
		currMail.inputText(currMail.from + ",");
		while(currMail.inputText().length < 180) {
		    currMail.inputText(currMail.inputText() + " " + autoBusinessWords[Math.floor(Math.random()*autoBusinessWords.length)]);
		}
		// Uncomment to catch what these actually are in console, for funsies :)        
		//console.log("" + currMail.inputText());
		currMail.respond();
	}
    
	// Auto R&D
	// Disables research to sell patents
	// Assigns employees only when research disabled (no cheating!)
	// You can manually disable research in-game to update employee numbers
	if(game.locked().research == false) {
		if(game.research().patents().length > 0) {
			if(game.research().active() == true)  { game.research().toggleProduction(); }
			else { game.research().sellPatents(); }
		} else if(game.research().active() == false) {
			if(game.research().intern() < game.units.peek(0)[0].num.val()) {
			    game.research().intern(game.units.peek(0)[0].num.val());
			}
			if(game.research().wage() < game.units.peek(0)[1].num.val()) {
			    game.research().wage(game.units.peek(0)[1].num.val());
			}
			if(game.research().sales() < game.units.peek(0)[2].num.val()) {
			    game.research().sales(game.units.peek(0)[2].num.val());
			}
			if(game.research().manager() < game.units.peek(0)[3].num.val()) {
			    game.research().manager(game.units.peek(0)[3].num.val());
			}
			game.research().toggleProduction(); 
		}
	}
    
	// Auto Make Investments
	if(game.locked().investments == false && game.activeInvestments().length < game.simultaneousInvestments.val()) {
		var bought = false;
		var checks = 0;
		// Check existing investment target times, fill shortest-found slot
		// Remember that target time is in milliseconds; 1 min = 60000 ms
		// Desired target times by default are 1, 9, 59, 1:59, 2:59, etc...
		// Desired percentages by default are based on number of slots
		// 1 slot = 50%, 2 = 40%, 3 = 30%, 4 = 20%, 5+ = 10%
		while(bought == false) {
			var targetMins = 1;
			var targetMs = 60000;
			var foundTarget = false;
			if(checks == 1) {
				targetMins = 9;
				targetMs = 9 * 60000;
			}
			else if(checks == 2) {
				targetMins = 59;
				targetMs = 59 * 60000;
			}
			else if(checks > 2) {
				targetMins = 59 + (60 * (checks - 2));
				targetMs = targetMins * 60000;
			}
			for(var i = 0; i < game.activeInvestments().length; i++) {
				if(game.activeInvestments()[i].targetTime == targetMs) {
			    		foundTarget = true;
				}
			}
			if(foundTarget == true) {
				checks++;
			} else {
				bought = true;
				game.makeInvestment(Math.max(60 - (game.simultaneousInvestments.val() * 10), 10), targetMins);
			}
		}
	}
    
	// Auto Handle Completed Investments
	if(game.pendingInvestmentCount.val() > 0) {
		for(var i = game.activeInvestments().length - 1; i >= 0; i--) {
			// Auto Sell
			if(game.activeInvestments()[i].timeRemaining() == 0) {
				// Auto Acquire
				if(game.locked().acquisitions == false && game.simultaneousInvestments.val() > 1 && game.activeAcquisitions().length < game.simultaneousAcquisitions.val()) {
					// Only acquire investments if some better investment is not closer to completion than
					// half of the finished investment's original target time.
					var sorted = game.activeInvestments().slice();
					var acquired = false;
					sorted.sort(function(a, b){return b.targetTime - a.targetTime});
					for(var j = 0; j < sorted.length; j++) {
						if(sorted[j].targetTime == game.activeInvestments()[i].targetTime) {
							acquired = true;
							break;
						} else if(sorted[j].timeRemaining() < game.activeInvestments()[i].targetTime * 0.5) {
							break;
						}
					}
					if(acquired == false) {
						game.activeInvestments()[i].handlePayout();
					} else {
						game.activeInvestments()[i].handleAcquisition();
					}
				} else {
					game.activeInvestments()[i].handlePayout();
				}
			}
		}
	}
    
	// Acquisition Management
	var autoChatPhrases = ["... Are you seriously wasting my time like this?", ", I really don't want to hear about it.", ", do you feel ready to fire your friends?", ", you put our glorious company to shame.", "!! Guess what?? You are an ass!", ", have you considered getting back to work?", ": I love hearing from you, almost as much as I hate it.", " is such a freakin tool, I mean really, they... oh ww lol!", " -- this better be good news.", ": ¯\_(ツ)_/¯", ", hold on, I'm playing this idle game called The Idle Class", ", hold on, my Trimps are just about to hit my target zone...", "!! Guess what?? Hevipelle eats ass!"];
	var currAcq;
	for (var i = game.activeAcquisitions().length - 1; i >= 0; i--) {
		currAcq = game.activeAcquisitions()[i];
		// Acquisition Clicker
		currAcq.fire();

		// Acquisition AutoHire
		if(currAcq.currentEmployees.val() > currAcq.initialEmployees * 0.5) {
			var currAcqWorker;
			for(var j = 0; j < currAcq.workers().length; j++) {
				currAcqWorker = currAcq.workers()[j];
				if(currAcqWorker.price.val() < game.currentCash.val()) {
					currAcqWorker.hire();
				}
			}
		}


		// Acquisition AutoChat
		// The cleanest way to handle these is by using the document elements.
		var currChatBox = currAcq.chats();
		var currChat;
		for(var j = currChatBox.length - 1; j >= 0; j--) {
			currChat = currChatBox[j];
			if(currChat.finished() == true) {
				currChat.close();
			} else if(currChat.messages().length > 0 && currChat.messages()[currChat.messages().length - 1].source != "You") {
				currChat.select();
				document.getElementById('chat-response').value = currChat.name + autoChatPhrases[Math.floor(Math.random()*autoChatPhrases.length)];
				document.getElementsByClassName("chat-submit")[0].click();
			}
		}

		// Acquisition AutoPolicy
		var currAcqInbox = currAcq.mail();
		var currAcqMail;
		for(var j = currAcqInbox.length - 1; j >= 0; j--) {
			currAcqMail = currAcqInbox[j];
			if(currAcqMail.replied() == true) { continue; }
			currAcqMail.inputText(currAcqMail.from + ",");
			while(currAcqMail.inputText().length < 180) {
				currAcqMail.inputText(currAcqMail.inputText() + " " + autoBusinessWords[Math.floor(Math.random()*autoBusinessWords.length)]);
			}
			currAcqMail.respond();
		}

		// Acquisition Sell
		if(currAcq.sold() == false && currAcq.currentEmployees.val() == 0) {
			currAcq.sell();
		}
	}
	
	// AutoBankruptcy
	// "game.stats()[40].val()" is the current bankruptcy bonus
	// By default, declare bankruptcy when next bonus will be double the current bonus.
	if(game.locked().bankruptcy == false && game.nextBankruptcyBonus.val() > game.stats()[40].val()) {
		game.restartGame();
	}
}

// Function that actually kicks off the Autocrat loop
// DISPLAY_LOOP_INTERVAL is defined by the game as being 0.1s / 100 ms
// I think this is fair for the Autocrat, but you can change it if you like!
setInterval(function() {
	idleClassAutocrat();
}, DISPLAY_LOOP_INTERVAL);
