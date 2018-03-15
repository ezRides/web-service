if (!String.format) {
        String.format = function (format) {
            var args = Array.prototype.slice.call (arguments, 1);
            return format.replace (/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
              ? args[number]
          : match;
            });
        };
    }
    
    function makeIdEditable (id) {
        get (id).contentEditable = "true";
    }
    
    function get (id) {
        // console.log (String.format ("Getting: {0}", id));
        return document.getElementById(id);
    } 