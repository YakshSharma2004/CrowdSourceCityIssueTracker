


const BASE_URL = "http://localhost:8080";


async function testFetchIssue() {
    try {
        const timestamp = Date.now();
        const email = `test${timestamp}@example.com`;
        const password = "password123";
        const fullName = "Test User";


        // 1. Signup
        const signupResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                email,
                fullName,
                password,
                requestedRole: "CITIZEN",
                reason: null
            })
        });

        if (!signupResponse.ok && signupResponse.status !== 201) {
            // throw new Error(`Signup failed: ${signupResponse.status}`);
        }

        // 2. Login (create token)
        const token = Buffer.from(`${email}:${password}`).toString('base64');
        const headers = {
            'Authorization': `Basic ${token}`,
            'Accept': 'application/json'
        };

        // 3. Get list of issues to find an ID
        const listResponse = await fetch(`${BASE_URL}/api/issues`, { headers });
        const listData = await listResponse.json();

        if (listData.content && listData.content.length > 0) {
            const issueId = listData.content[0].id;




            // 4. Fetch specific issue details
            const detailResponse = await fetch(`${BASE_URL}/api/issues/${issueId}`, { headers });
            const detailData = await detailResponse.json();

            require('fs').writeFileSync('issue_response.json', JSON.stringify(detailData, null, 2));
            console.log("Written to issue_response.json");
        } else {
            console.log("No issues found. Creating one...");
            // Create an issue if none exist
            const createResponse = await fetch(`${BASE_URL}/api/issues`, {
                method: "POST",
                headers: { ...headers, "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: "Test Issue " + timestamp,
                    description: "This is a test issue description.",
                    category: "ROADS",
                    severity: "MEDIUM",
                    address: "123 Test St",
                    latitude: 40.7128,
                    longitude: -74.0060
                })
            });
            
            if (createResponse.ok) {
                 const newIssue = await createResponse.json();
                 console.log("Created issue:", newIssue.id);
                 console.log("Issue Details Response:");
                 console.log(JSON.stringify(newIssue, null, 2));
            } else {
                console.log("Failed to create issue:", createResponse.status);
            }
        }

    } catch (error) {
        console.error("Test failed:", error);
    }
}


testFetchIssue();
