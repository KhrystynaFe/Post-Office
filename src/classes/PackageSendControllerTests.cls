@IsTest
private class PackageSendControllerTests {
    @IsTest static void getPostOfficesTest() {
        String expectedNameOfPostOffice = '0';
        insert new Post_Office__c(Name = expectedNameOfPostOffice);
        Integer expectedNumberOfPostOffices = 1;

        Test.startTest();
        List<Post_Office__c> result = PackageSendController.getPostOffices();
        Test.stopTest();

        System.assertEquals(expectedNumberOfPostOffices, result.size());
        System.assertEquals(expectedNameOfPostOffice, result[0].Name);
    }

    @IsTest static void TestPickListValues() {
        Map<String, List<PackageSendController.PickListOption>> result = new Map<String, List<PackageSendController.PickListOption>>();
        Test.startTest();
        result = (Map<String, List<PackageSendController.PickListOption>>) JSON.deserialize(PackageSendController.getPickListValue(), Map<String, List<PackageSendController.PickListOption>>.class);
        Test.stopTest();
        System.assert(!result.get('Size__c').isEmpty());
        System.assert(!result.get('Weight__c').isEmpty());
        System.assert(!result.get('Type__c').isEmpty());
    }
}