@IsTest
global class MockHttpResponsePackageDateTime implements HttpCalloutMock {
    global HttpResponse respond(HttpRequest req) {
        HttpResponse res = new HttpResponse();
        res.setBody('{"abbreviation":"GMT","client_ip":"79.110.132.69","datetime":"2021-12-16T14:48:39.569937+00:00",' +
                '"day_of_week":4,"day_of_year":350,"dst":false,"dst_from":null,"dst_offset":0,"dst_until":null,"raw_offset":0,' +
                '"timezone":"Europe/London","unixtime":1639666119,"utc_datetime":"2021-12-16T14:48:39.569937+00:00","utc_offset":"+00:00","week_number":50}');
        res.setStatusCode(200);
        res.setStatus('OK');
        return res;
    }
}