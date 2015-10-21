/*
jshint -W098, -W026, -W003, -W068, -W004, -W033, -W030, -W117, -W116, -W069
*/
(function() {
    'use strict';

    angular
        .module('app.formentry')
        .factory('FormsMetaData', FormsMetaData);

    FormsMetaData.$inject = [];

    function FormsMetaData() {

        var forms = {};
        forms['form1'] = {
          name: 'form1',
          uuid: '1339a535-e38f-44cd-8cf8-f42f7c5f2ab7',
          encounterType:'8d5b2be0-c2cc-11de-8d13-0010c6dffd0f',
          encounterTypeName:'ADULT RETURN'
        };

        forms['form2'] = {
          name: 'form2',
          uuid: '585ac02c-96f6-4e3b-b41f-8d8d04f149bf',
          encounterType:'8d5b3108-c2cc-11de-8d13-0010c6dffd0f',
          encounterTypeName:'PEADS RETURN'
        };

        forms['form3'] = {
          name: 'form3',
          uuid: 'bd5908a8-9d8d-41a4-a351-2f70fe00eae6',
          encounterType:'b1e9ed0f-5222-4d47-98f7-5678b8a21ebd',
          encounterTypeName:'POST ANTENATAL'
        };        

        forms['triage'] = {
          name: 'triage',
          uuid: 'a2b811ed-6942-405a-b7f8-e7ad6143966c',
          encounterType:'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
          encounterTypeName:'TRIAGE'
        };
        
         forms['poclab'] = {
          name: 'poclab',
          uuid: '6e6a4eef-4387-413d-b313-d1fc8cd32fd6',
          encounterType:'5544894d-8add-4521-a0ea-c124c5886c8b',
          encounterTypeName:'POC LAB'
        };

        var service = {
            getForm: getForm
        };

        return service;

        function getForm(uuid) {
          //console.log('Available forms');
          //console.log(forms);

        var result =  _.find(forms,function(form) {
            //console.log(form)
            if (form.uuid === uuid) return form;
            else if (form.encounterType === uuid) return form;
            else if (form.name === uuid) return form;
          });
          if (result === undefined) return forms['form1']; //should be refactored once everything is well structured
          else return result;
        }
    }
})();
