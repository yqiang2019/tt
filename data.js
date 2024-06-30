const data = {
    id: 1,
    type: "startNode",
    name: "Start",
    children: [
        {
            id: 2,
            type: "userNode",
            name: "User",
            startDate: "2021-01-01",
            endDate: "2021-01-09",
            children: [
                {
                    id: 4,
                    type: "userNode",
                    name: "User",
                    startDate: "2021-01-10",
                    endDate: "2021-01-25",
                    children: [
                        {
                            id: 5,
                            type: "endNode",
                            name: "end"
                        },
                    ]
                },
            ]
        },
        {
            id: 3,
            type: "userNode",
            name: "User",
            startDate: "2021-01-02",
            endDate: "2021-01-07",
            children: [
                {
                    id: 5,
                    type: "endNode",
                    name: "end"
                },
            ]
        },
    ]
}