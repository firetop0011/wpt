import time
import json


def main(request, response):
    operation = request.GET.first(b"operation").decode('utf-8')
    uuid = request.GET.first(b"uuid").decode('utf-8')

    if operation == "retrieve":
        with request.server.stash.lock:
            value = request.server.stash.take(key=uuid)

            if value is None:
                value = []

            return [("Content-Type", "application/json")], json.dumps(value)
    elif operation == "dispatch":
        report = request.GET.first(b"report").decode('utf-8')
        if report is None:
            return [("Content-Type", "application/json")], json.dumps({'error': 'Missing report.', 'uuid': uuid})

        with request.server.stash.lock:
            stashReports = request.server.stash.take(key=uuid)
            if stashReports is None:
                stashReports = []

            stashReports.append(report)
            request.server.stash.put(key=uuid, value=stashReports)

        # return acknowledgement report
        return [("Content-Type", "text/plain")], b"Recorded report " + uuid
    else:
        return [("Content-Type", "application/json")], json.dumps({'error': 'Invalid operation.', 'uuid': uuid})
