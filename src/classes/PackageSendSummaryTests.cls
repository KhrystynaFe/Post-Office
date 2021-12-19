@IsTest
private class PackageSendSummaryTests {
    @IsTest static void getZeroDistanceTest() {
        Decimal expectedResult = 0;
        Post_Office__c postOfficeFrom = new Post_Office__c(Location__Latitude__s = 50.518477, Location__Longitude__s = 30.568477);
        Post_Office__c postOfficeTo = new Post_Office__c(Location__Latitude__s = 50.518477, Location__Longitude__s = 30.568477);
        insert postOfficeTo;
        insert postOfficeFrom;
        String jsonPackage = JSON.serialize(new List<Package__c>{
                new Package__c(Sent_from__c = postOfficeFrom.Id, Sent_to__c = postOfficeTo.Id)
        });
        Decimal result;
        Test.startTest();
        result = PackageSendSummaryController.getDistance(jsonPackage);
        Test.stopTest();
        System.assertEquals(expectedResult, result);
    }

    @IsTest static void getDistanceTest() {
        Decimal expectedResult = 2000.05;
        Post_Office__c postOfficeFrom = new Post_Office__c(Location__Latitude__s = 50.518477, Location__Longitude__s = 30.568477);
        Post_Office__c postOfficeTo = new Post_Office__c(Location__Latitude__s = 50.538171, Location__Longitude__s = 2.097782);
        insert postOfficeTo;
        insert postOfficeFrom;
        String jsonPackage = JSON.serialize(new List<Package__c>{
                new Package__c(Sent_from__c = postOfficeFrom.Id, Sent_to__c = postOfficeTo.Id)
        });
        Decimal result;
        Test.startTest();
        result = PackageSendSummaryController.getDistance(jsonPackage);
        Test.stopTest();
        System.assertEquals(expectedResult, result);
    }
}