const optionsQuests = [
  { value: "jack", label: "Jack" },
  { value: "lucy", label: "Lucy" },
];

// users
export const usersFormItems = [
  {
    gutter: 16,
    items: [
      {
        span: 12,
        name: "username",
        label: "логин",
        isRequired: true,
        placeholder: "пожалуйста, введите логин",
        element: {
          name: "Input",
          onChange: true,
          options: [],
          multiple: null,
        },
      },
      {
        span: 12,
        name: "password",
        label: "пароль",
        isRequired: true,
        placeholder: "пожалуйста, введите пароль",
        element: {
          name: "Input",
          onChange: true,
          options: [],
          multiple: null,
        },
      },
    ],
  },
  {
    gutter: 16,
    items: [
      {
        span: 24,
        name: "quest",
        label: "квест",
        isRequired: true,
        placeholder: "пожалуйста, выберите квест",
        element: {
          name: "Select",
          onChange: true,
          options: optionsQuests,
          multiple: false,
        },
      },
    ],
  },
];
