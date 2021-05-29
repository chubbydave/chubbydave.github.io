function addEntry() {
  if ($("#add-entry-input").val()) {
    let template = 
    `
    <div class="list-entry">
      <button class="list-entry-check"></button>
      <button class="list-entry-remove">X</button>
      <p class="list-entry-text">` + $("#add-entry-input").val() + `</p>
    </div>
    `;
    $("#add-entry-input").val("");
    $(template).appendTo("body").slideUp(0).slideDown(500);

    $(".list-entry-check").click(function() {
      if ($(this).css("opacity") == "0.5") {
        $(this).parent().find(".list-entry-text").css("text-decoration", "none");
        $(this).animate({
          opacity: "1"
        }, 500);
      } else if ($(this).css("opacity") == "1") {
        $(this).parent().find(".list-entry-text").css("text-decoration", "line-through");
        $(this).animate({
          opacity: "0.5"
        }, 500);
      }
    })
  
    $(".list-entry-remove").click(function() {
      $(this).parent().slideUp(500, function() {$(this).remove()});
    })
  }
}

$(document).ready(function() {
  $("#add-entry-submit").click(function() {
    addEntry();
  });
  $("#add-entry-input").keypress(function(e) {
    if (e.keyCode == 13) {
      addEntry();
    }
  })
});