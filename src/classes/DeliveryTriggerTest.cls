@IsTest
public with sharing class DeliveryTriggerTest {
    @IsTest static void CreatingNotUniqueDelivery(){
        Post_Office__c postOfficeFrom = new Post_Office__c(Location__latitude__s = 50.518477, Location__longitude__s = 30.568477);
        Post_Office__c postOfficeTo = new Post_Office__c(Location__latitude__s = 50.538171, Location__longitude__s = 30.568477);
        insert postOfficeTo;
        insert postOfficeFrom;
        Delivery__c deliveryFirst = new Delivery__c(Sender__c = postOfficeFrom.Id, Receiver__c = postOfficeTo.Id);
        insert deliveryFirst;
        Delivery__c deliverySecond = new Delivery__c(Sender__c = postOfficeFrom.Id, Receiver__c = postOfficeTo.Id);
        Exception notUniqueException;
        Test.startTest();
        try {
            insert deliverySecond;
        } catch (Exception e) {
            notUniqueException = e;
        }
        Test.stopTest();
        System.assert(notUniqueException.getMessage().contains('Delivery is not unique'));
    }

    @IsTest static void SettingPackageDeliveryFieldAfterCreatingPackage(){
        Test.setMock(HttpCalloutMock.class, new MockHttpResponsePackageDateTime());
        Post_Office__c postOfficeFrom = new Post_Office__c(Location__latitude__s = 50.518477, Location__longitude__s = 30.568477);
        Post_Office__c postOfficeTo = new Post_Office__c(Location__latitude__s = 50.518477, Location__longitude__s = 30.568477);
        insert postOfficeFrom;
        insert postOfficeTo;
        Package__c packageToTest = new Package__c(Sent_from__c = postOfficeFrom.Id, Sent_to__c = postOfficeTo.Id);
        Delivery__c delivery = new Delivery__c(Sender__c = postOfficeFrom.Id, Receiver__c = postOfficeTo.Id);
        Test.startTest();
        insert packageToTest;
        insert delivery;
        Test.stopTest();
        System.assertEquals(delivery.Id, [SELECT Delivery__c FROM Package__c WHERE Id =: packageToTest.Id].Delivery__c);
    }

    @IsTest static void SettingPackageDeliveryFieldABeforeCreatingPackage(){
        Test.setMock(HttpCalloutMock.class, new MockHttpResponsePackageDateTime());
        Post_Office__c postOfficeFrom = new Post_Office__c(Location__latitude__s = 50.518477, Location__longitude__s = 30.568477);
        Post_Office__c postOfficeTo = new Post_Office__c(Location__latitude__s = 50.518477, Location__longitude__s = 30.568477);
        insert postOfficeFrom;
        insert postOfficeTo;
        Package__c packageToTest = new Package__c(Sent_from__c = postOfficeFrom.Id, Sent_to__c = postOfficeTo.Id);
        Delivery__c delivery = new Delivery__c(Sender__c = postOfficeFrom.Id, Receiver__c = postOfficeTo.Id);
        Test.startTest();
        insert delivery;
        insert packageToTest;
        Test.stopTest();
        System.assertEquals(delivery.Id, [SELECT Delivery__c FROM Package__c WHERE Id =: packageToTest.Id].Delivery__c);
    }
}