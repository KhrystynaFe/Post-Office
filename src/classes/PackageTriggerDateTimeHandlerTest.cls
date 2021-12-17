/**
 * Created by fedos on 16-Dec-21.
 */
@IsTest
private class PackageTriggerDateTimeHandlerTest {
@IsTest static void TestSettingDateAndTimeToTheNewPackages() {
    Test.setMock(HttpCalloutMock.class, new MockHttpResponsePackageDateTime());

    Post_Office__c postOfficeFrom = new Post_Office__c(Location__latitude__s = 50.518477, Location__longitude__s = 30.568477);
    Post_Office__c postOfficeTo = new Post_Office__c(Location__latitude__s = 50.518477, Location__longitude__s = 30.568477);
    insert postOfficeFrom;
    insert postOfficeTo;
    Package__c newPackage = new Package__c(Sent_from__c = postOfficeFrom.Id, Sent_to__c = postOfficeTo.Id);
    Test.startTest();
    insert newPackage;
    Test.stopTest();
    System.assert(!(newPackage.Accepted_Datetime__c == null));
}
}