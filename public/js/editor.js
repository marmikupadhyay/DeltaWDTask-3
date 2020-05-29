window.addEventListener("DOMContentLoaded", event => {
  richTextField.document.designMode = "On";
  var frames = window.frames;
  for (var i = 0; i < frames.length; i++) {
    frames[i].document.designMode = "On";
  }

  document.querySelectorAll(".submit").forEach(btn => {
    btn.onclick = submit_form;
  });
  document.querySelectorAll(".bold").forEach(btn => {
    btn.onclick = iBold;
  });
  document.querySelectorAll(".italic").forEach(btn => {
    btn.onclick = iItalic;
  });
  document.querySelectorAll(".underline").forEach(btn => {
    btn.onclick = iUnderline;
  });
  document.querySelectorAll(".link").forEach(btn => {
    btn.onclick = iLink;
  });
  document.querySelectorAll(".unlink").forEach(btn => {
    btn.onclick = iUnLink;
  });
  document.querySelectorAll(".insimg").forEach(btn => {
    btn.onclick = iImage;
  });
  document.querySelectorAll(".fontname").forEach(btn => {
    btn.onclick = iFontname;
  });
  document.querySelectorAll(".fontsize").forEach(btn => {
    btn.onclick = iFontsize;
  });
  document.querySelectorAll(".justifyleft").forEach(btn => {
    btn.onclick = iJustifyleft;
  });
  document.querySelectorAll(".justifycenter").forEach(btn => {
    btn.onclick = iJustifycenter;
  });
  document.querySelectorAll(".justifyright").forEach(btn => {
    btn.onclick = iJustifyright;
  });
  document.querySelectorAll(".undo").forEach(btn => {
    btn.onclick = iUndo;
  });
  document.querySelectorAll(".redo").forEach(btn => {
    btn.onclick = iRedo;
  });
  document.querySelectorAll(".textcolor2").forEach(btn => {
    btn.onclick = iTextcolor2;
  });

  function iFrameOn() {
    richTextField.document.designMode = "On";
  }
  function submit_form() {
    var theForm = document.getElementById("myform");
    theForm.elements["body"].value =
      window.frames["richTextField"].document.body.innerHTML;
    theForm.submit();
  }
  function iBold() {
    for (var i = 0; i < frames.length; i++) {
      frames[i].document.execCommand("bold", false, null);
    }
  }
  function iUnderline() {
    for (var i = 0; i < frames.length; i++) {
      frames[i].document.execCommand("underline", false, null);
    }
  }
  function iItalic() {
    for (var i = 0; i < frames.length; i++) {
      frames[i].document.execCommand("italic", false, null);
    }
  }
  function iLink() {
    var linkURL = prompt("Enter the URL for this link:", "http://");
    for (var i = 0; i < frames.length; i++) {
      frames[i].document.execCommand("CreateLink", false, linkURL);
    }
  }
  function iUnLink() {
    for (var i = 0; i < frames.length; i++) {
      frames[i].document.execCommand("unlink", false, null);
    }
  }
  function iImage() {
    var imgSrc = prompt("Enter image location", "");
    if (imgSrc != null) {
      for (var i = 0; i < frames.length; i++) {
        frames[i].document.execCommand("insertimage", false, imgSrc);
      }
    }
  }
  function iFontname() {
    var font = prompt("Enter a valid css font name", "");
    if (font != null) {
      for (var i = 0; i < frames.length; i++) {
        frames[i].document.execCommand("fontName", true, font);
      }
    }
  }

  function iFontsize() {
    var size = prompt("Enter a valid font size(1-7)", "");
    if (size != null) {
      for (var i = 0; i < frames.length; i++) {
        frames[i].document.execCommand("fontSize", true, size);
      }
    }
  }

  function iJustifyleft() {
    for (var i = 0; i < frames.length; i++) {
      frames[i].document.execCommand("justifyLeft", false, null);
    }
  }
  function iJustifycenter() {
    for (var i = 0; i < frames.length; i++) {
      frames[i].document.execCommand("justifyCenter", false, null);
    }
  }
  function iJustifyright() {
    for (var i = 0; i < frames.length; i++) {
      frames[i].document.execCommand("justifyRight", false, null);
    }
  }
  function iUndo() {
    for (var i = 0; i < frames.length; i++) {
      frames[i].document.execCommand("undo", false, null);
    }
  }
  function iRedo() {
    for (var i = 0; i < frames.length; i++) {
      frames[i].document.execCommand("redo", false, null);
    }
  }
  function iTextcolor2() {
    var color = document.getElementById("colorbox").value;
    console.log(color);
    for (var i = 0; i < frames.length; i++) {
      frames[i].document.execCommand("foreColor", false, color);
    }
  }
});
