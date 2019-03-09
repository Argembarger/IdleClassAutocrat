# IdleClassAutocrat
The Autocrat, an automation tool for the idle game The Idle Class by Small Gray Games, https://www.smallgraygames.com/the-idle-class

Made for fun by Argembarger in December 2018.

V1 is old legacy version all in one function.
V2 is classed-up version. Simple unscientific testing indicates that V2 is about 1/3 faster than V1. May not work on very old browsers.
V3 has even more polish and uses an outer-loop + inner-loop kind of structure. It has more explicit settings that are more obviously visible in the constructor at the top of the class. There are also some funny code-jokes for my own amusement :)

This tool basically handles everything in the game, including the bankruptcy loop. It tries not to spend more than 10% of your money on anything. It's certainly not an optimized system, and there are many manual decisions you can make to speed up progression, which I think is one of the nice things about this tool. There are also some achievements in the game that you would probably want to do without this tool enabled.

Instructions are in the script itself, but the basic gist is that you can just paste it into the developer console on your browser after the game loads, and it will start doing its thing. You can feel free to modify any setting or tweak the system to your liking, just read through the code. 

The code is comprised of the Autocrat function, which essentially checks every interactable game feature, followed by an interval-looping function to kick the whole thing off.

When you're done using the tool, simply refresh the game window.

I haven't noticed any problems in quite some time. It should be more or less safe on the game's save data, although I managed to corrupt the game tons of times while writing this, probing around the game's code willy-nilly :)

CHANGELOG
v3.1.0 - AutoBizName: Autocrat now tries to rename the business, but only if it is called "Unnamed Business". Naming follows the format "AutoBiz#X" from 0 to break_infinity.js, where X is the highest AutoBiz# found in the Past Businesses plus one. Robotic and soulless, just like business.
v3.1.1 - AutoOutgoingMail: Sends randomized outgoing emails. Fancy delay so you can see what it's generating. Tries not to send an email that would be wasted due to no active investments/acquisitions. Sends HR emails if stress is greater than 50.
