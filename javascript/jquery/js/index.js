$(function() { 

   var checkButton = function() {
     var enabled = false;
     $("#inputs .row").each(function() {
       if ($(this).find('.elem').length !== 0) {
         enabled = true;
       }
     });
     if (!enabled) {
       $("#nextButton").hide();
     }
   };


   var mergeData = function () {
     var minIdx = undefined;
     var minValue = undefined;
     $("#inputs .row").each(function() {
       var idx = $(this).attr('idx');
       var first = $(this).find('.elem:first');
       if (first.length !== 0) { 
         var currentValue = parseInt(first.text(), 10);
         if (minValue === undefined || currentValue < minValue) { 
           minIdx = idx;
           minValue = currentValue;
         }
       }
     });
     return minIdx;
   };

   var appendOutput = function(value) { 
       var elem = $("<div>").text(value.toString()).addClass("col-md-1");
       $("#output").append(elem);
   };

   var popInput = function(idx) { 
       var elem = $("#inputs .row[idx="+idx+"] .elem:first");
       elem.remove();
       return elem.text();
   };



  $(document).ready(function() {
    var data = [];
    data[0] = [1, 2, 4, 7];
    data[1] = [2, 4, 6];
    data[2] = [2, 4, 8];
    var initialDraw = function() {
       $.each(data, function (idx) {
         var row = $("<div>").addClass("row").attr('idx', idx);
         $.each(this, function() {
           var elem = $("<div>").text(this.toString()).addClass('elem').addClass("col-md-1");
           row.append(elem);
         });
         $("#inputs").append(row);
      });
    };
    initialDraw();
    checkButton();
  });

  $("#nextButton").click(function() {
      var idx = mergeData();
      if (idx !== undefined) { 
        var value = popInput(idx);
        appendOutput(value);
        checkButton();
      }
  });
});
