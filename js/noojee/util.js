/**
 * Copyright 2012 Brett Sutton
 * (Adapted for Google Chrome by Sven Werlen)
 *
 * This file is part of Noojee Click.
 * 
 * Noojee Click is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by the 
 * Free Software Foundation, either version 3 of the License, or (at your 
 * option) any later version.
 * 
 * Noojee Click is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
 * or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License 
 * for more details.
 * 
 * You should have received a copy of the GNU General Public License along 
 * with Noojee Click. If not, see http://www.gnu.org/licenses/.
 **/

noojeeClick.ns(function() { with (noojeeClick.LIB) {

theApp.util =
{

log: function (msg)
{
	if (theApp.prefs.getBoolValue("enableLogging") == true)
	{
		var now = new Date();
		var hour = now.getHours();
		var min = now.getMinutes();
		var sec = now.getSeconds();
		var mil = now.getMilliseconds();
		console.log(arguments.callee.caller.name + " " + hour + ":" + min + ":" + sec + ":" + mil + " info: " + msg);
	}
},

debug: function (module, msg)
{

	if (theApp.prefs.getBoolValue("enableDebugging") == true)
	{
		var filter = theApp.prefs.getValue("debugFilter");

		if (filter.search(module, "i") >= 0)
		{
			var now = new Date();
			var hour = now.getHours();
			var min = now.getMinutes();
			var sec = now.getSeconds();
			var mil = now.getMilliseconds();
			console.log(arguments.callee.caller.name + " " + hour + ":" + min + ":" + sec + ":" + mil+ " debug (" + module + "): " + msg);
		}
	}
},

error: function (msg)
{
		var now = new Date();
		var hour = now.getHours();
		var min = now.getMinutes();
		var sec = now.getSeconds();
		var mil = now.getMilliseconds();
		console.error(arguments.callee.caller.name + " " + hour + ":" + min + ":" + sec + ":" + mil + " error: " + msg);
},

Right: function(str, n)
{
	if (n <= 0)
		return "";
	else if (n > String(str).length)
		return str;
	else
	{
		var iLen = String(str).length;
		return String(str).substring(iLen, iLen - n);
	}
},

Left: function(str, n)
{
	if (n <= 0)
		return "";
	else if (n > String(str).length)
		return str;
	else
	{
		return String(str).substring(0, n);
	}
},

trim: function(string)
{
	return string.replace(/^\s+|\s+$/g, "");
},

ltrim: function(string)
{
	return string.replace(/^\s+/, "");
},


rtrim: function()
{
	return string.replace(/\s+$/, "");
},

isRClick: function(e)
{
	var emod = (e) ? (e.eventPhase) ? "W3C" : "NN4" : (window.event) ? "IE4+" : "unknown";

	return (emod == "NN4") ? (e.which > 1) : (e.button == 2);
},


addGlobalStyle: function (document, css)
{
	var success = false;
	var style = document.createElement("style");
	style.setAttribute("noojeeclick", "true");
	style.id = "noojeeClickStyle";
	style.type = "text/css";
	style.textContent = css;
	var head = document.getElementsByTagName('head')[0];
	if (head != null)
	{
		head.appendChild(style);
		success = true;
	}

	return success;
},

hasGlobalStyle: function (document)
{
	var hasStyle = false;

	var noojeeStyle = document.getElementById("noojeeClickStyle");
	if (noojeeStyle != null)
		hasStyle = true;
	this.debug("util", "hasStyle=" + hasStyle);
	return hasStyle;
},

showError: function (response, message)
{
	this.log("showError r=" + response + " m=" + message);
	theApp.prompts.showAlert(message);
	//theApp.dialstatus.getInstance().updateStatus(message);
},

showException: function (method, e)
{
	this.debug("util", "Exception caught in method '" + method + "' " + e);
	var message = 
		"An exeption occured in method '" + method + "' " + e.name + ".\n" +
		"Error description: " + e.description + ".\n" +
		"Error number: " + e.number + ".\n" +
		"Error message: " + e.message;
	this.log(message);

	this.debug("util", this.stacktrace());
	theApp.prompts.showAlert(message);
},

stacktrace: function ()
{
	var f = this.stacktrace;
	var stack = "Stack trace:";
	while (f)
	{
		if (f != this.stacktrace)
			stack += "\n" + f.name;
		f = f.caller;
	}
	return stack;

},

showTree: function (node)
{
	this.debug("util", "showTree");
	while (node != null)
	{
		this.debug("util", node + ":" + node.nodeName + ":" + node.nodeValue + (node.text != undefined ? (":" + node.text) : ""));
		node = node.parentNode;
	}
},



getWindowList: function ()
{
	var documentList = [];
	var count = 0;

	this.debug("util", "getWindowList a");
	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
	        .getService(Components.interfaces.nsIWindowMediator);
	var enumerator = wm.getEnumerator(null);
	while (enumerator.hasMoreElements())
	{
		var win = enumerator.getNext();

		this.debug("util", win);
		if (win.content != undefined && this.isHtmlDocument(win.content.document))
		{
			documentList[count++] = win.content.document;
			this.debug("util", "added=" + win.content.document);

		}
	}

	this.debug("util", "winList count=" + count);
	return documentList;
},

/*
 * Returns the class name of the argument or undefined if it's not a valid
 * JavaScript object.
 */
getObjectClass: function (obj)
{
	if (obj && obj.constructor && obj.constructor.toString)
	{
		var arr = obj.constructor.toString().match(/function\s*(\w+)/);

		if (arr && arr.length == 2)
		{
			return arr[1];
		}
	}

	return undefined;
},


isHtmlDocument: function (object)
{
	var isHtml = false;
	var name = object.toString();

	if (name.indexOf("HTMLDocument") != -1)
	{
		isHtml = true;
	}
	return isHtml;
},

isDigit: function (str)
{
	var isDigit = false;

	if (str.length == 1)
	{
		var digits = "1234567890";
		if (digits.indexOf(str) != -1)
			isDigit = true;
	}
	return isDigit;
},

getParentDocument: function (element)
{
	this.debug("util", "element=" + element);
	var doc = element;
	while (!(doc instanceof HTMLDocument))
	{
		doc = doc.parentNode;
		this.debug("util", "doc=" + doc);
	}
	return doc;
},

// Retrieves the channel name of the users own extension (including technology)
// from the Noojee Click configuration.
getLocalChannel: function ()
{
	var channel = null;
	var extension = theApp.prefs.getValue("extension");
	
	if (extension != null)
	{
		if (extension.indexOf("/") == -1)
		{
			channel = "SIP/" + extension;
		}
		else
		{
			channel = extension;
		}
	}
	return channel;

},

extractChannel: function (uniqueChannel)
{
	var channel = uniqueChannel;

	var index = uniqueChannel.indexOf('-');
	if (index != -1)
	{
		channel = uniqueChannel.substring(0, index);
	}
	return channel;
}	,
	
//Tests if the given channel (from an event usually) matches the users
//local channel from Noojee Click's configuration.
isLocalChannel: function (channel)
{
	return this.extractChannel(channel).toLowerCase() == this.getLocalChannel().toLowerCase();
},

	

getSelectedText: function ()
{
	var selectedText = this.trim(theApp.phonepatterns.extractPhoneNo(this.trim(this.getRawSelectedText())));

	return selectedText;
},


getRawSelectedText: function ()
{
	var selectedText = "";
	selectedText = document.commandDispatcher.focusedWindow.getSelection().toString();
	return selectedText;
},

getClipboardText: function ()
{
	var pasteText = "";
	var clip = Components.classes["@mozilla.org/widget/clipboard;1"].getService(Components.interfaces.nsIClipboard);
	if (!clip)
		return false;
	var trans = Components.classes["@mozilla.org/widget/transferable;1"]
	        .createInstance(Components.interfaces.nsITransferable);
	if (!trans)
		return false;

	trans.addDataFlavor("text/unicode");

	clip.getData(trans, clip.kGlobalClipboard);
	var str = new Object();
	var strLength = new Object();
	try
	{
		trans.getTransferData("text/unicode", str, strLength);
		var temp = "";
		
		if (str)
		{
			str = str.value.QueryInterface(Components.interfaces.nsISupportsString);
			temp = str.data.substring(0, strLength.value / 2);
			
			// remove duplicate strings
			temp = temp.replace(/\ \ /g, " ");
			this.debug("util", "clipboard: removed doublspaces" + temp);
		}

		pasteText = temp;

	}
	catch (e)
	{
		// Clipboard is empty (we think)
		this.log("clipboard access threw exception, may just be empty " + e);
	}

	return pasteText;
},

};

}});


