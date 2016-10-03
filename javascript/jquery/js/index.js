$(function() { 
   var checkButton = function(data) {
      var enabled = false;
      $.each(data, function () {
        if (this.length != 0) {
          enabled = true;
       }
     });
     if (!enabled) {
       $("#nextButton").hide();
     }
   };

   var hiddenInputRow = $("#inputs .row:hidden");
   var hiddenInputElem = $("#inputs .elem:hidden");
   var hiddenOutputElem = $("#output .elem:hidden");
   var draw = function(data, output) {
      $("#inputs .row:visible").remove();
      $("#output .elem:visible").remove();

      $.each(data, function () {
        var row = hiddenInputRow.clone().show();
        $.each(this, function() {
          var elem = hiddenInputElem.clone().text(this.toString()).show().addClass("col-md-1");
          row.append(elem);
        });
        $("#inputs").append(row);
     });

     $.each(output, function () {
       var elem = hiddenOutputElem.clone().text(this.toString()).show().addClass("col-md-1");
       $("#output").append(elem);
     });

     checkButton(data);
   };

   var mergeData = function (data) {
      var minIdx = undefined;
      $.each(data, function (idx) {
        if (minIdx === undefined  && this.length != 0) {
          minIdx = idx;
        }
        else if (minIdx !== undefined && this.length > 0 && data[minIdx][0] > this[0]) {
          minIdx = idx;
        }
      });
      return minIdx;

   };

  var data = [];
  data[0] = [1, 2, 4, 7];
  data[1] = [2, 4, 6];
  var output = [];

  $(document).ready(function() {
     draw(data, output);
  });

  $("#nextButton").click(function() {
      var idx = mergeData(data);
      if (idx !== undefined) { 
        var value = data[idx].shift();
        output.push(value);
      }
      draw(data, output);
  });
});
