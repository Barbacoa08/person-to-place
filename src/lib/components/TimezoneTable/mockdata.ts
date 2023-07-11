// NOTE: timezone data is from https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

export const mocktabledata = [
  {
    id: 1,
    name: "John Doe",
    timezone: "America/Los_Angeles",
    notes:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae diam euismod, aliquam lorem eget, ultricies odio. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla",
  },
  {
    id: 2,
    name: "Jane Doe",
    timezone: "America/Los_Angeles",
    notes:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae diam euismod, aliquam lorem eget, ultricies odio. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla",
  },
  {
    id: 3,
    name: "John Smith",
    timezone: "Europe/London",
    notes:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae diam euismod, aliquam lorem eget, ultricies odio. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla",
  },
  {
    id: 4,
    name: "Jane Smith",
    timezone: "Europe/London",
    notes:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae diam euismod, aliquam lorem eget, ultricies odio. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla",
  },
  {
    id: 5,
    name: "Frank Flannery",
    timezone: "Asia/Anadyr",
    notes:
      "prefers meetings in the morning, but is flexible. 'I like to get my work done early in the day, so I can spend time with my family in the evening.'",
  },
  {
    id: 6,
    name: "Alfred Alfredson",
    timezone: "Asia/Calcutta",
    notes: "prefers meetings in the morning, with a hard stop at 11:30am.",
  },
  {
    id: 7,
    name: "Bobby Bobberson",
    timezone: "America/St_Johns",
    notes: "prefers monday meetings.",
  },
  {
    id: 8,
    name: "Joe Sebastian",
    timezone: "US/Central",
    notes: "will refuse all friday meetings.",
  },
];

const jsondata = `{"TimezoneTable":[{"id":"de181b11-b9cc-4491-97bf-c013a1deb6a1","name":"John Doe","notes":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae diam euismod, aliquam lorem eget, ultricies odio. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla","timezone":"America/Los_Angeles"},{"id":"e8b9fa28-75dc-46d7-b764-cb2d8f1bfce1","name":"Jane Doe","notes":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae diam euismod, aliquam lorem eget, ultricies odio. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla","timezone":"America/Los_Angeles"},{"id":"56ae5058-9449-47e3-a236-88f040e06cdc","name":"John Smith","notes":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae diam euismod, aliquam lorem eget, ultricies odio. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla","timezone":"Europe/London"},{"id":"f675ae7a-c8fa-4846-a436-0de392a93497","name":"Jane Smith","notes":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla vitae diam euismod, aliquam lorem eget, ultricies odio. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla facilisi. Nulla","timezone":"Europe/London"},{"id":"65ee2886-3c9a-44b9-b279-37415bf020aa","name":"Frank Flannery","notes":"prefers meetings in the morning, but is flexible. 'I like to get my work done early in the day, so I can spend time with my family in the evening.'","timezone":"Asia/Anadyr"},{"id":"5a73afca-9ef6-489a-8fed-0e8d7511b9cf","name":"Alfred Alfredson","notes":"prefers meetings in the morning, with a hard stop at 11:30am","timezone":"Asia/Calcutta"},{"id":"174ce8ae-3310-487d-8344-f91b136209bc","name":"Bobby Bobberson","notes":"prefers monday meetings","timezone":"America/St_Johns"}]}`;
