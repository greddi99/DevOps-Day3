spbackButton.init("Name of list");

var spbackButton = (function () {
    var _prevFieldsArray = new Array();
    var _currentStep;
    var _prevPageStep;
 
    function setCookie(c_name,value,exdays)
    {
        var exdate=new Date();
        exdate.setDate(exdate.getDate() + exdays);
        var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
        document.cookie=c_name + "=" + c_value;
    }
 
    function getCookie(c_name)
    {
        var c_value = document.cookie;
        var c_start = c_value.indexOf(" " + c_name + "=");
        if (c_start == -1)
        {
            c_start = c_value.indexOf(c_name + "=");
        }
        if (c_start == -1)
        {
            c_value = null;
        }
        else
        {
            c_start = c_value.indexOf("=", c_start) + 1;
            var c_end = c_value.indexOf(";", c_start);
            if (c_end == -1)
            {
                c_end = c_value.length;
            }
            c_value = unescape(c_value.substring(c_start,c_end));
        }
        return c_value;
    }
 
    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
 
    var isBack = getCookie('backClicked');
    if (isBack && isBack.length > 0) {
        setCookie('backClicked', '', 0);
        if (isBack == "empty") {
            location.href = "EditForm.aspx?ID=" + getParameterByName("ID") + "&IsDlg=1";
        }
        else {
            location.href = "EditForm.aspx?ID=" + getParameterByName("ID") + "&FirstField=" + isBack + "&IsDlg=1";
        }
    }
 
    function loadButton() {
        var nextButton = $('input[value=\'Volgende\']');
        nextButton.parent('td').before('<input btnback="" button="" erug="" id="\" value="\" type="\">
 
');
        var backButtons = $('input#btnBack');
        backButtons.attr('class', 'ms-ButtonHeightWidth');
        backButtons.click(function () {
               setCookie('backClicked', _prevPageStep, 1);
 
            nextButton.trigger('click');
        });
    }
 
    function init(listName) {
        function loadContext() {
            var clientContext = new SP.ClientContext.get_current();
            var web = clientContext.get_web();
            var list = web.get_lists().getByTitle(listName);
            this.listFields = list.get_fields();
            clientContext.load(this.listFields);
            clientContext.executeQueryAsync(Function.createDelegate(this,
                onListFieldsQuerySucceeded));
 
            function onListFieldsQuerySucceeded() {
                var fieldEnumerator = listFields.getEnumerator();
                var prevIsPage = false;
 
                _prevPageStep = "empty";
 
                while (fieldEnumerator.moveNext()) {
                    var oField = fieldEnumerator.get_current();
 
                    if (prevIsPage) {
                        var currentStepName = oField.get_internalName();
                        if (currentStepName == _currentStep) // no need to go any further
                        {
                            loadButton();
                            return;
                        }
 
                        _prevPageStep = currentStepName;
                        _prevFieldsArray.push(currentStepName);
                        prevIsPage = false;
                    }
 
                    var fType = oField.get_fieldTypeKind();
                    if (fType === SP.FieldType.pageSeparator) {
                        prevIsPage = true;
                    }
                }
 
                loadButton();
            }
        }
 
        _currentStep = getParameterByName("FirstField");
        if (!_currentStep || _currentStep.length == 0)
            return; // no back button needed
 
        // Loadprev fields
        ExecuteOrDelayUntilScriptLoaded(loadContext, 'sp.js');
 
         
    }
 
    var obj = {};
    obj.init = init;
    return obj;
})();