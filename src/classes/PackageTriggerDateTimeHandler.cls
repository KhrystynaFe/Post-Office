/**
 * Created by fedos on 16-Dec-21.
 */

public class PackageTriggerDateTimeHandler {
    @Future(Callout=true)
    public static void getDateTime (Set<Id> newPackagesId) {
        List<Package__c> newPackages = [SELECT Id FROM Package__c WHERE Id IN :newPackagesId];
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('http://worldtimeapi.org/api/timezone/Europe/London');
        request.setMethod('GET');
        HttpResponse res = http.send(request);
        List<Package__c> packagesToUpdate = new list<Package__c>();
        if(res.getStatusCode() == 200) {
            String dateAndTimeString = (res.getBody()).substringBetween('"datetime":"','","day_of_week"');
            Datetime dateAndTime = ((DateTime)JSON.deserialize('"' + dateAndTimeString + '"', DateTime.class));
            for(Package__c newPackage : newPackages) {
                newPackage.Accepted_Datetime__c = dateAndTime;
                packagesToUpdate.add(newPackage);
            }
            update packagesToUpdate;
        }
    }
}