import urllib2, re, sys, json
from HTMLParser import HTMLParser

skipTags = ["a"]
classes = ["Amazon", "Barbarian", "Paladin", "Sorceress", "Druid", "Assassin", "Necromancer"]
items = []
debug = False
globLadder = False
urls = ["http://classic.battle.net/diablo2exp/items/runewords-original.shtml", "http://classic.battle.net/diablo2exp/items/runewords-110.shtml", "http://classic.battle.net/diablo2exp/items/runewords-111.shtml"]
version = 1.09

class ItemParser:
	def __init__(self, name = None, sockets = None, runes = [], itemType = None):
		self.sockets = sockets
		self.itemType = itemType
		self.classRestriction = None
		self.runes = runes
		self.properties = []
		self.name = name

		self.version = version
		self.ladder = globLadder

		self.first = False

	def __str__(self):
		return "Sockets: %d\nItem Type: %s\nClass: %s\nRunes: %s\nProperties: %s\nName: %s" % (self.sockets, self.itemType, self.classRestriction, str(self.runes), str(self.properties), self.name)

	def blank(self):
		return (self.sockets == None and self.itemType == None and self.classRestriction == None and self.runes == [] and self.properties == [] and self.name == None)

	def parseItem(self, data, index, lastTag):
		namePattern = re.compile("^[A-Za-z\s\*\']+$")
		classPattern = re.compile("^\s\([A-Za-z]*\)$")
		bodySocketPattern = re.compile("^[1-6] Socket [A-Za-z\s\*\/\(\)]+$")
		runePattern = re.compile("^(([A-Z][a-z]+)(\s\+\s))+([A-Z][a-z]+)$")


		if(lastTag in ["br", "u", "font"]):
			if(self.name == None):
				return
			self.properties.append(data)
		elif(namePattern.match(data)):
			self.name = data.replace("*", "")
		elif(classPattern.match(data)):
			data = data.replace("(", "").replace(")", "").replace(" ", "")
			self.classRestriction = data
		elif(bodySocketPattern.match(data)):
			value = data.split(" Socket ")
			self.sockets = int(value[0])
			self.itemType = value[1].replace("*", "")
		elif(runePattern.match(data)):
			self.runes = data.split(" + ")
		#else:
		#	print("Data: ", data, "Index: ", index, "lastTag: ", lastTag)

class MyHTMLParser(HTMLParser):
	def __init__(self):
		HTMLParser.__init__(self)
		self.inTable = False
		self.inRow = False
		self.inTd = False
		self.inItemAttributesTd = False
		self.lastTag = None
		self.tempItem = ItemParser()

		self.columnNumber = 0

	def __checkAttrs(self, attrs):
		for tuple in attrs:
			if tuple[0] == "cellpadding":
				if tuple[1] == "10":
					return True
				else:
					return False
		return False

	#Handles start html tags, keeps flags to see if we are currently in an element
	def handle_starttag(self, tag, attrs):
		if(tag == "table" and self.__checkAttrs(attrs)):
			self.inTable = True
		elif(tag == "tr"):
			self.inRow = True
		elif(tag == "td"):
			self.inTd = True
		elif(self.inTd):
			self.lastTag = tag

	#Handles end html tags, adds entries if we are ending an appropriate tag
	def handle_endtag(self, tag):
		if(tag == "table"):
			self.inTable = False
		elif(tag == "tr"):
			self.inRow = False
			self.columnNumber = 0
			self.lastTag = None
		elif(tag == "td"):
			self.inTd = False

	#This the data inbetween attributes
	def handle_data(self, data):
		global globLadder
		data = data.rstrip()
		if(self.lastTag in skipTags):
			return

		ignoreRW = ["Spirit", "Phoenix", "Fortitude"]
		ignoreExtra = ["Weapons", "Body Armor", "Shields"]

		if(self.columnNumber == 0 and self.lastTag == None and data == "The following Rune Words will only work on the Battle.net Realms for Ladder Characters only. They will not work for single oropen characters or non-ladder characters"):
			globLadder = True

		if(self.inTd):
			if(self.columnNumber == 0 and not self.tempItem.blank() and self.tempItem.name != None and self.tempItem.sockets != None):
					items.append(self.tempItem)
					self.tempItem = ItemParser()


			#This if statement is not needed, but it makes the code clearer
			if(data in ignoreRW):
				self.tempItem.parseItem(data, self.columnNumber, self.lastTag)

			elif(data in ignoreExtra and not self.tempItem.first):
				self.tempItem.itemType = data
				self.tempItem.first = True
				return

			elif(data in ignoreExtra and self.tempItem.first):
				name = self.tempItem.name
				sockets = self.tempItem.sockets
				runes = self.tempItem.runes
				itemType = data

				self.tempItem.ladder = globLadder
				items.append(self.tempItem)
				self.tempItem = ItemParser(name, sockets, runes, itemType)

			else:
				self.tempItem.parseItem(data, self.columnNumber, self.lastTag)

			self.columnNumber+= 1

def wrtieJSON(dump):
	file.write("data.push(" + dump +");\n")

#Strips undefined html attributes and whitespace		
def getFeed(url):
	ret = urllib2.urlopen(url).read().replace("<em>", "").replace("</em>", "").replace("\r", "").replace("<strong>","").replace("</strong>", "").replace("<code>", "").replace("</code>", "").replace("\n","").replace("\t","")
	return ret

if __name__ == "__main__":
	mhp = MyHTMLParser()
	print "Calculating..."

	if(len(sys.argv) == 2 and sys.argv[1] == "debug"):
		debug = True

	for url in urls:
		mhp = MyHTMLParser()
		mhp.feed(getFeed(url))
		if(not mhp.tempItem.blank()):
			items.append(mhp.tempItem)
		globLadder = False
		version += 0.01

	if(not debug):
		file = open("script/data.js", "w")
		file.write("let data = [];\n")
		for item in items:
			wrtieJSON(json.dumps(item.__dict__))
		file.close()
	else:
		print("Found debug flag, not outputting")
