var birthday = document.getElementById("birthday");
var wedding = document.getElementById("wedding");
var funeral = document.getElementById("funeral");

birthday.addEventListener("click", e => {
  var header = "Birthday Invitation";
  var footer = "Invited By - Your Name Here";
  var question = "Any Food Preferences ?";
  var body = `<font face="Courier" size="6"><b style="">Its the [Enter Age Here] Birthday of [Enter Name Here].</b></font><div><font face="Courier" size="5"><br></font></div><div><font face="Arial" size="4">You are invited to join the amazing party that will take place at [Enter the venue here].</font></div><div><font face="Arial" size="4">Don't miss it. Trust me you will regret it.</font></div><div><font face="Arial" size="4">Be there sharp by - [Enter Time Here].</font></div><div><font face="Arial" size="4">Don't forget to follow the dress code of [Enter Dress Code here] if you don't wanna look like an idiot in front of others.</font></div>`;
  document.getElementById("header2").value = header;
  document.getElementById("footer2").value = footer;
  document.getElementById("question").value = question;
  window.frames["richTextField"].document.body.innerHTML = body;
});
wedding.addEventListener("click", e => {
  var header = "Wedding Invitation";
  var footer = "Invited By - Your Name Here";
  var question = "Any Food Preferences ?";
  var body = `<font face="Courier" size="6"><b>[Name 1] WEDS [Name 2]</b></font><br><div><font face="Courier" size="5"><br></font></div><div><font face="Arial" size="4">You are invited to join the wedding of [name 1] and [name 2] that will take place at [Enter the venue here].</font></div><div><font face="Arial" size="4">Please join us in this auspicious occasion&nbsp;of two people meeting there soulmates.</font></div><div><font face="Arial" size="4">Be there sharp by - [Enter Time Here].</font></div><div><font face="Arial" size="4">Don't forget to follow the dress code of [Enter Dress Code here].</font></div><div><br></div><div>You can add other details below.</div>`;
  document.getElementById("header2").value = header;
  document.getElementById("footer2").value = footer;
  document.getElementById("question").value = question;
  window.frames["richTextField"].document.body.innerHTML = body;
});
funeral.addEventListener("click", e => {
  var header = "Funeral Invitation";
  var footer = "Invited By - Your Name Here";
  var question = "How many people will come with you ?";
  var body = `<div><span style="font-family: Arial; font-size: large;">With a heavy heart I have to break it to you that [Enter name here] aged [enter age here] passed away on [Enter date here].</span></div><div><span style="font-family: Arial; font-size: large;">You are invited to join the Funeral that will take place at [Enter the venue here].</span></div><div><font face="Arial" size="4">Where we will mourn for our beloved [Enter name here].</font></div><div><font face="Arial" size="4">Time-[ time here ].</font></div><div><br></div><div><font face="Arial" size="4">Other Details here.</font></div>`;
  document.getElementById("header2").value = header;
  document.getElementById("footer2").value = footer;
  document.getElementById("question").value = question;
  window.frames["richTextField"].document.body.innerHTML = body;
});
