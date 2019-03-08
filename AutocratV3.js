"use strict";
// The Idle Class Autocrat
// made with luv by argembarger
// v3.1.0, last tested with The Idle Class v0.5.3
// USE AT OWN RISK -- feel free to steal
// not responsible if your game gets hurt >_>
// Export Early / Export Often
// There are options! Skim through the code to see ‘em
// Settings are in the constructor right underneath these comments.
// See the very bottom of this script for the actual loop function.
//
// Instructions: just copy this entire text file (ctrl-a, ctrl-c)
// and paste it (ctrl-v) into the console, and hit enter to submit
// (Use F12 to access developer console on most browsers)
// Only paste once!
//
// IMPORTANT NOTES:
// You can change any of the below values at runtime through the console by inputting activeIdleClassAutocrat.<desiredStatName>
// You have to re-inject this code on every refresh.
// I have observed page-cache-wrecking errors on occasion, not sure if it's this script or just me messing around while making it.
// I recommend exporting your save once in a while
// Clearing the page's cache data through the browser can restore function if your save file gets corrupted and it fails to load.
class IdleClassAutocrat {
	constructor() {
		// THE FOLLOWING 6 VALUES CAN BE TWEAKED TO YOUR LIKING
		// FEEL FREE TO TWEAK IF YOU FEEL LIKE THINGS ARE TOO SLOW
		// Especially the bankruptcy modifier...
		// Early on, a higher employee/upgrade spend may be desirable.
		this.autocratManageLoopMillis = 2500; // Default 2500, runs an Autocrat update every 2.5 seconds
		this.autocratInnerLoopMillis = 100; // Default 100, does individual Autocrat actions every 0.1 seconds
		this.upgradeSpendFraction = 1.0; // Default 1.0, willing to spend 100% on upgrades, RATIO VALUE, 0.67 = 67%
		this.employeeSpendFraction = 0.999; // Default 0.999, willing to spend 99.9% on employees, RATIO VALUE, 0.67 = 67%
		this.maxAllowableRisk = 0.0; // Default 0.0%, stops R&D hiring above this risk value, PERCENTAGE VALUE, 67.0 = 67%
		this.acquisitionStopHiringFraction = 0.666; // Default 0.666, stops firing acq employees at less than 66.6% progress, RATIO VALUE, 0.67 = 67%
		this.bankruptcyResetFraction = 0.1; // Default 0.1, makes every bankruptcy 110%, RATIO VALUE, 0.67 = 67%
		
		// ONES WITH LISTS OF WORDS AND PHRASES CAN BE EDITED OR ADDED TO IF YOU FANCY
		this.autoBusinessWords = ['synergy', 'downsize', 'bandwidth', 'stakeholders', 'shareolders', 'clients', 'customers', 'profits', 'ROI', 'ideate', 'ideation', 'globalization', 'evergreen', 'disruptive', 'disrupt', 'innovation', 'innovate', 'dynamism', 'millennial', 'holistic', 'paradigm', 'wheelhouse', 'B2B', 'B2C', 'analytics', 'brand', 'branding', 'hyperlocal', 'optimization', 'client', 'customer', 'profit', 'outsourcing', 'outsource', 'startup', 'marketing', 'sales', 'agile', 'mission', 'executive', 'stocks', 'investments', 'investment', 'shares', 'valuation',  'investment', 'shareholders', 'BYOD', 'advertainment', 'marketing', 'deliverable', 'actionable', 'hacking', 'KPI', 'pivot', 'leverage', 'startup', 'downsizing', 'outsourcing', 'unicorn', 'SEO', 'wunderkind', 'market', 'EBITDA', 'ASAP', 'EOD', 'actionable', 'action', 'influencer', 'CTR', 'gamified', 'gamification', 'revenue', 'overhead'];
		this.autoChatPhrases = ["... Are you seriously wasting my time like this?", ", I really don't want to hear about it.", ", do you feel ready to fire your friends?", ", you put our glorious company to shame.", "!! Guess what?? You are an ass!", ", have you considered getting back to work?", ": I love hearing from you, almost as much as I hate it.", " is such a freakin tool, I mean really, they... oh ww lol!", " -- this better be good news.", ": ¯\_(ツ)_/¯", ", hold on, I'm playing this idle game called The Idle Class", ", hold on, my Trimps are just about to hit my target zone...", "!! Guess what?? Hevipelle eats ass!"];
		// Shamelessly stolen from game code
		this.firstNames = [ 'John', 'Jane', 'Steve', 'Bill', 'Mark', 'Sheryl', 'Larry', 'Travis', 'George', 'Marissa', 'Jeff', 'Ken', 'Dara', 'Richard' ];
		this.lastNames = [ 'Smith', 'Johnson', 'Jones', 'Williams', 'Taylor', 'Singh', 'Wang', 'Sato', 'Kim', 'Tremblay', 'Rodriguez', 'Martin', 'Rossi', 'Schmidt' ];
		
		// THE REST BELOW SHOULDN'T NEED TO BE MESSED WITH
		this.currOuterProcessHandle = 0; // Everything else is private
		this.currProcess = 0; // PRIVATE
		this.currProcessHandle = 0; // PRIVATE
		this.currUpgrade; // STILL PRIVATE
		this.currEmployee; // ETC.
		this.currMail;
		this.invBought;
		this.invChecks;
		this.invTargetMins;
		this.invTargetMs;
		this.invFoundTarget;
		this.invSorted;
		this.invAcquired;
		this.currAcq;
		this.acqCurrWorker;
		this.acqCurrChat;
		this.acqCurrMail;
		this.autocratSelfNaming = function() {
			if(game.businessName().name() !== "Unnamed Business") return;
			let pastBizCheckIndex = -1;
			let maxKnownBusiness = -1;
			while(pastBizCheckIndex < game.pastBusinesses().length - 1) {
				pastBizCheckIndex = pastBizCheckIndex + 1;
				let pastBizName = game.pastBusinesses()[pastBizCheckIndex].name;
				if(pastBizName.startsWith("AutoBiz#")) {
					let foundBiz = parseInt(pastBizName.substr(pastBizName.indexOf("#") + 1, pastBizName.length), 10);
					if(foundBiz > maxKnownBusiness) maxKnownBusiness = foundBiz;
				}
			}
			game.businessName().newName("AutoBiz#" + (maxKnownBusiness + 1));
			game.businessName().save();
		}
		this.randomBizWord = function() {
			return this.autoBusinessWords[Math.floor(Math.random()*this.autoBusinessWords.length)];
		};
		this.randomDialogue = function() {
			return this.autoChatPhrases[Math.floor(Math.random()*this.autoChatPhrases.length)];
		};
		// Shamelessly stolen from game code
		this.randomName = function() {
       			return this.firstNames[Math.floor(Math.random() * this.firstNames.length)] + ' ' + this.lastNames[Math.floor(Math.random() * this.lastNames.length)];
  		};
		
		this.autoEarnDollars = function() {
			game.addManualClicks();
		};
		this.autoUpgrade = function() {
			if(this.upgradeSpendFraction >= 1.0) {
				game.buyAllUpgrades();		
			} else {
				for(let i = 0; i < game.availableUpgrades().length; i++) {
					this.currUpgrade = game.availableUpgrades()[i];
					if(this.currUpgrade.price.val() < (game.currentCash.val() * this.upgradeSpendFraction)) {
						this.currUpgrade.buy();
					}
				}
			}
		};
		this.autoHR = function() {
			// Based on currently-selected Purchase Rate.
			// Try to buy first employee of each type right away, though.
			for(let i = 0; i <= 11; i++) {
				this.currEmployee = game.units.peek(0)[i];
				if(this.currEmployee.num.val() <= 4 && (this.currEmployee.price.val() <= game.currentCash.val())) {
					this.currEmployee.buy();
				} else if(this.currEmployee.price.val() < (game.currentCash.val() * this.employeeSpendFraction)) {
					this.currEmployee.buy();
				}
			}
		};
		this.autoMail = function() {
			// Automatically replies to emails with "<sender_name>: <string_of_biz_babble>"
			for(let i = game.mail().length - 1; i >= 0; i--) {
				this.currMail = game.mail()[i];
				// EMAIL CHEAT: You can uncomment the following line to exploit emails
				if(this.currMail.replied() === true) { continue; }
				this.currMail.inputText(this.currMail.from + ",");
				while(this.currMail.inputText().length < 180) {
					this.currMail.inputText(this.currMail.inputText() + " " + this.randomBizWord());
				}
				// Uncomment to catch what these actually are in console, for funsies :)        
				//console.log("" + this.currMail.inputText());
				this.currMail.respond();
			}
		};
		this.autoScience = function() {
			// Disables research to sell patents
			// Assigns employees only when research disabled (no cheating!)
			// You can manually disable research in-game to update employee numbers
			if(game.research().patents().length > 0) {
				if(game.research().active() === true)  { game.research().toggleProduction(); }
				else { game.research().sellPatents(); }
			} else if(game.research().active() === false) {
				if(game.research().risk.baseVal() <= this.maxAllowableRisk) {
					var hiredSomeone = false;
					if(game.research().intern() < game.units.peek(0)[0].num.val()) {
						game.research().intern(parseInt(game.research().intern() + 1));
						hiredSomeone = true;
					}
					if(game.research().wage() < game.units.peek(0)[1].num.val()) {
						game.research().wage(parseInt(game.research().wage() + 1));
						hiredSomeone = true;
					}
					// There is no need for autoselling.
					//if(game.research().sales() < game.units.peek(0)[2].num.val()) {
					//	game.research().sales(parseInt(game.research().sales() + 1));
					//	hiredSomeone = true;
					//}
					// There is no need for storage.
					//if(game.research().manager() < game.units.peek(0)[3].num.val()) {
					//	game.research().manager(parseInt(game.research().manager() + 1));
					//	hiredSomeone = true;
					//}
					if(hiredSomeone == false) { // Toggle production when no one to hire
						game.research().toggleProduction(); 
					}
				}
				else { // Toggle production when risk is reached
					game.research().toggleProduction(); 
				}
			}
		};
		this.autoInvest = function() {
			if(game.activeInvestments().length < game.simultaneousInvestments.val()) {
				this.invBought = false;
				this.invChecks = 0;
				// Check existing investment target times, fill shortest-found slot
				// Remember that target time is in milliseconds; 1 min = 60000 ms
				// Desired target times by default are 1, 9, 59, 1:59, 2:59, etc...
				// Desired percentages by default are based on number of slots
				// 1 slot = 50%, 2 = 40%, 3 = 30%, 4 = 20%, 5+ = 10%
				while(this.invBought === false) {
					this.invTargetMins = 1;
					this.invTargetMs = 60000;
					this.invFoundTarget = false;
					if(this.invChecks === 1) {
						this.invTargetMins = 9;
						this.invTargetMs = 9 * 60000;
					}
					else if(this.invChecks === 2) {
						this.invTargetMins = 59;
						this.invTargetMs = 59 * 60000;
					}
					else if(this.invChecks > 2) {
						this.invTargetMins = 59 + (60 * (this.invChecks - 2));
						this.invTargetMs = this.invTargetMins * 60000;
					}
					for(let i = 0; i < game.activeInvestments().length; i++) {
						if(game.activeInvestments()[i].targetTime === this.invTargetMs) {
								this.invFoundTarget = true;
						}
					}
					if(this.invFoundTarget === true) {
						this.invChecks++;
					} else {
						this.invBought = true;
						game.makeInvestment(Math.max(60 - (game.simultaneousInvestments.val() * 10), 10), this.invTargetMins);
					}
				}
			}
		};
		this.autoDivest = function() {
			if(game.pendingInvestmentCount.val() > 0) {
				for(let i = game.activeInvestments().length - 1; i >= 0; i--) {
					// Auto Sell
					if(game.activeInvestments()[i].timeRemaining() === 0) {
						// Auto Acquire
						if(game.locked().acquisitions === false && game.simultaneousInvestments.val() > 1 && game.activeAcquisitions().length < game.simultaneousAcquisitions.val()) {
							// Only acquire investments if some better investment is not closer to completion than
							// half of the finished investment's original target time.
							this.invSorted = game.activeInvestments().slice();
							this.invAcquired = false;
							this.invSorted.sort(function(a, b){return b.targetTime - a.targetTime});
							for(let j = 0; j < this.invSorted.length; j++) {
								if(this.invSorted[j].targetTime === game.activeInvestments()[i].targetTime) {
									this.invAcquired = true;
									break;
								} else if(this.invSorted[j].timeRemaining() < game.activeInvestments()[i].targetTime * 0.5) {
									break;
								}
							}
							if(this.invAcquired === false) {
								game.activeInvestments()[i].handlePayout();
							} else {
								game.activeInvestments()[i].handleAcquisition();
							}
						} else if(game.pendingAcquisitionCount.val() === 0) {
							// ONLY pay out if there ISN'T a currently-pending acquisition.
							// If an acquisition is actively paying out, do nothing, simply wait.
							game.activeInvestments()[i].handlePayout();
						}
					}
				}
			}
		};
		this.autoMicromanage = function() {
			for (let i = game.activeAcquisitions().length - 1; i >= 0; i--) {
				this.currAcq = game.activeAcquisitions()[i];
				// Acquisition Clicker
				this.currAcq.fire();

				// Acquisition AutoAssign
				if(this.currAcq.currentEmployees.val() > this.currAcq.initialEmployees * this.acquisitionStopHiringFraction) {
					for(let j = 0; j < this.currAcq.workers().length; j++) {
						this.acqCurrWorker = this.currAcq.workers()[j];
						if(this.acqCurrWorker.price.val() < game.currentCash.val()) {
							this.acqCurrWorker.hire();
						}
					}
				}


				// Acquisition AutoChat
				// The cleanest way to handle these is by using the document elements.
				for(let j = this.currAcq.chats().length - 1; j >= 0; j--) {
					this.acqCurrChat = this.currAcq.chats()[j];
					if(this.acqCurrChat.finished() === true) {
						this.acqCurrChat.close();
					} else if(this.acqCurrChat.messages().length > 0 && this.acqCurrChat.messages()[this.acqCurrChat.messages().length - 1].source !== "You") {
						this.acqCurrChat.select();
						document.getElementById('chat-response').value = this.acqCurrChat.name + this.randomDialogue();
						document.getElementsByClassName("chat-submit")[0].click();
					}
				}

				// Acquisition AutoPolicy
				for(let j = this.currAcq.mail().length - 1; j >= 0; j--) {
					this.acqCurrMail = this.currAcq.mail()[j];
					if(this.acqCurrMail.replied() === true) { continue; }
					this.acqCurrMail.inputText(this.acqCurrMail.from + ",");
					while(this.acqCurrMail.inputText().length < 180) {
						this.acqCurrMail.inputText(this.acqCurrMail.inputText() + " " + this.randomBizWord());
					}
					this.acqCurrMail.respond();
				}

				// Acquisition Sell
				if(this.currAcq.sold() === false && this.currAcq.currentEmployees.val() === 0) {
					this.currAcq.sell();
				}
			}
		};
		
		this.autoUntilEmails = function() {
			this.autoEarnDollars();
			this.autoUpgrade();
			this.autoHR();
		};
		this.autoUntilResearchAndDevelopment = function() {
			this.autoEarnDollars();
			this.autoUpgrade();
			this.autoHR();
			this.autoMail();
		};
		this.autoUntilInvestments = function() {
			this.autoEarnDollars();
			this.autoUpgrade();
			this.autoHR();
			this.autoMail();
			this.autoScience();
		};
		this.autoUntilAcquisitions = function() {
			this.autoEarnDollars();
			this.autoUpgrade();
			this.autoHR();
			this.autoMail();
			this.autoScience();
			this.autoInvest();
			this.autoDivest();
		};
		this.autoUntilBankruptcy = function() {
			this.autoEarnDollars();
			this.autoUpgrade();
			this.autoHR();
			this.autoMail();
			this.autoScience();
			this.autoInvest();
			this.autoDivest();
			this.autoMicromanage();
		};
		// Function to manage state of autocratInnerLoopMillis inner loop
		this.autoAutocrat = function() { // fractionOfCurrentBankruptcyBonus
			this.autocratSelfNaming();
			switch(this.currProcess) {
				case 0: // Not running; new Autocrat state. Clear any existing loop and start pre-email loop.
					this.currProcess = 1;
					if(this.currProcessHandle !== 0) { clearInterval(this.currProcessHandle); }
					this.currProcessHandle = setInterval(this.autoUntilEmails.bind(this), this.autocratInnerLoopMillis);
					break;
				case 1: // Wait for emails before changing loop to pre-R&D loop.
					if(game.locked().mail === true) { break; }
					this.currProcess = 2;
					clearInterval(this.currProcessHandle);
					this.currProcessHandle = setInterval(this.autoUntilResearchAndDevelopment.bind(this), this.autocratInnerLoopMillis);
					break;
				case 2: // Wait for R&D before changing loop to pre-Investments loop.
					if(game.locked().research === true) { break; }
					this.currProcess = 3;
					clearInterval(this.currProcessHandle);
					this.currProcessHandle = setInterval(this.autoUntilInvestments.bind(this), this.autocratInnerLoopMillis);
					break;
				case 3: // Wait for Investments before changing loop to pre-Acquisitions loop.
					if(game.locked().investments === true) { break; }
					this.currProcess = 4;
					clearInterval(this.currProcessHandle);
					this.currProcessHandle = setInterval(this.autoUntilAcquisitions.bind(this), this.autocratInnerLoopMillis);
					break;
				case 4: // Wait for Acquisitions before changing loop to pre-Bankruptcy loop
					if(game.locked().acquisitions === true) { break; }
					this.currProcess = 5;
					clearInterval(this.currProcessHandle);
					this.currProcessHandle = setInterval(this.autoUntilBankruptcy.bind(this), this.autocratInnerLoopMillis);
					break;
				case 5: // Wait until bankruptcy, then wait for conditions, before declaring bankruptcy and restarting loop.
					if(game.locked().mail === true) { this.currProcess = 0; break; }
					if(game.locked().bankruptcy === true) { break; }
					// "game.stats()[39].val()" is the current bankruptcy bonus
					// By default, declare bankruptcy when next bonus will be double the current bonus.
					if(game.nextBankruptcyBonus.val() > game.stats()[39].val() * this.bankruptcyResetFraction) {
						this.currProcess = 0;
						game.restartGame();
					}
					break;
				default:
					this.currProcess = 0;
			}
		};
		
		// Function to lazily kick off autocratManageLoopMillis outer loop
		this.autoAutoAutocrat = function() {
			if(this.currOuterProcessHandle !== 0) { clearInterval(this.currOuterProcessHandle); }
			this.currOuterProcessHandle = setInterval(this.autoAutocrat.bind(this), this.autocratManageLoopMillis);
		};
	}
	
	// Static function to super-lazily kick off The Autocrat
	static autoAutoAutoAutocrat() {
		var newlyBirthedAutocrat = new IdleClassAutocrat();
		newlyBirthedAutocrat.autoAutoAutocrat();
		return newlyBirthedAutocrat;
	}
}

// Actually kicks off the Autocrat.
var activeIdleClassAutocrat = IdleClassAutocrat.autoAutoAutoAutocrat();
