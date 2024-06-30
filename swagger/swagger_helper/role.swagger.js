const addRole = {
  tags: ["Role"],
  description: "Add Role",
  summary: "Add Role",
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            role_name: {
              type: "string",
              description: "Enter role name",
              required: true,
            },
            modules: {
              type: "array",
              items: {
                type: "string"
              },
              description: "Enter access module access by role",
              required: true,
            },
            is_active: {
              type: "boolean",
              description: "is active true/false (optional default true)",
              required: false,
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "ok",
      content: {
        "application/json": {
          schema: {
            type: "object",
          },
        },
      },
    },
  },
};
const getRole = {
  tags: ["Role"],
  description: "Get Role list",
  summary: "Get Role list",
  parameters: [
    {
      name: "search",
      in: "query",
      description: "Enter the string to search(based on role_name)",
      type: "string",
    },
    {
      name: "page",
      in: "query",
      description: "Enter the page number",
      type: "Number",
    },
    {
      name: "pageSize",
      in: "query",
      description: "Enter the pageSize",
      type: "Number",
    },
    {
      name: "sortBy",
      in: "query",
      description: "Enter the column name for sorting",
      type: "string",
    },
    {
      name: "sortOrder",
      in: "query",
      description: "Enter the page sortOrder",
      type: "string",
    },
  ],
  responses: {
    200: {
      description: "ok",
      content: {
        "application/json": {
          schema: {
            type: "object",
          },
        },
      },
    },
  },
};
const getRoleById = {
  tags: ["Role"],
  description: "get Role by roleId",
  summary: "get Role by roleId",
  parameters: [
    {
      name: "roleId",
      in: "path",
      description: "roleId",
      required: true,
    },
  ],
  responses: {
    200: {
      description: "ok",
      content: {
        "application/json": {
          schema: {
            type: "object",
          },
        },
      },
    },
  },
};
const updateRoleById = {
  tags: ["Role"],
  description: "Update Role by roleId",
  summary: "Update Role by roleId",
  parameters: [
    {
      name: "roleId",
      in: "path",
      description: "roleId",
      required: true,
    },
  ],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            role_name: {
              type: "string",
              description: "Enter role name",
              required: true,
            },
            modules: {
              type: "array",
              items: {
                type: "string"
              },
              description: "Enter access module access by role",
              required: true,
            },
            is_active: {
              type: "boolean",
              description: "is active true/false (optional default true)",
              required: false,
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "ok",
      content: {
        "application/json": {
          schema: {
            type: "object",
          },
        },
      },
    },
  },
};
const RoleRoutes = {
  "/api/role": {
    post: addRole,
  },
  "/api/role/": {
    get: getRole,
  },
  "/api/role/{roleId}": {
    get: getRoleById,
  },
  "/api/role/{roleId}": {
    put: updateRoleById,
  },
};

module.exports = RoleRoutes;
