// api
import {
  getQuestVersions,
  getQuests,
  getRoles,
  getSTExpenseSubCategories,
  getUsers,
} from "../api/APIUtils";

export const layoutMarginLeft = 200;

export const datePickerFormat = "DD.MM.YYYY";
export const rangePickerFormat = datePickerFormat;
export const timePickerFormat = "HH:mm";
export const minuteStep = 5;

const optionsPaidFrom = [
  {
    label: "с рабочей карты",
    value: "work_card",
  },
  {
    label: "со своих",
    value: "own",
  },
  {
    label: "с кассы",
    value: "cash_register",
  },
];

const optionsTypes = [
  {
    label: "бонус",
    value: "bonus",
  },
  {
    label: "штраф",
    value: "penalty",
  },
];

const fetchUsers = async () => {
  try {
    const res = await getUsers();
    if (res.status === 200) {
      const formattedOptions = res.data.map((el) => ({
        label: (el.last_name ? el.last_name.toLowerCase() : "") + " " + el.first_name.toLowerCase() + " " + (el.middle_name ? el.middle_name.toLowerCase() : ""),
        value: el.id,
      }));
      console.log(res.data)
      return formattedOptions;
    }
  } catch (error) {
    console.log(error);
  }
};
const fetchRoles = async () => {
  try {
    const res = await getRoles();
    if (res.status === 200) {
      const formattedOptions = res.data.map((el) => ({
        label: el.name.toLowerCase(),
        value: el.id,
      }));

      return formattedOptions;
    }
  } catch (error) {
    console.log(error);
  }
};
const fetchSubCategories = async () => {
  try {
    const res = await getSTExpenseSubCategories();
    if (res.status === 200) {
      const formattedOptions = res.data.map((el) => ({
        label: el.name.toLowerCase(),
        value: el.id,
      }));

      return formattedOptions;
    }
  } catch (error) {
    console.log(error);
  }
};
const fetchQuests = async () => {
  try {
    const res = await getQuests();
    if (res.status === 200) {
      const formattedOptions = res.data.map((el) => ({
        label: el.name.toLowerCase(),
        value: el.id,
      }));

      return formattedOptions;
    }
  } catch (error) {
    console.log(error);
  }
};
const fetchQuestVersions = async () => {
  try {
    const res = await getQuestVersions();
    if (res.status === 200) {
      const formattedOptions = res.data.map((el) => ({
        label: el.name.toLowerCase(),
        value: el.id,
      }));

      return formattedOptions;
    }
  } catch (error) {
    console.log(error);
  }
};

// getUsersFormItems
export const getUsersFormItems = async () => {
  const optionsRoles = await fetchRoles();
  const optionsQuests = await fetchQuests();

  const formItems = [
    {
      gutter: 16,
      items: [
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "username",
          label: "логин",
          isRequired: true,
          placeholder: "пожалуйста, введите логин",
          element: {
            name: "Input",
            options: [],
            multiple: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "password",
          label: "пароль",
          isRequired: false,
          placeholder: "пожалуйста, введите пароль",
          element: {
            name: "Input",
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
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "last_name",
          label: "имя",
          isRequired: true,
          placeholder: "пожалуйста, введите логин",
          element: {
            name: "Input",
            options: [],
            multiple: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "first_name",
          label: "фамилия",
          isRequired: true,
          placeholder: "пожалуйста, введите пароль",
          element: {
            name: "Input",
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
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "middle_name",
          label: "отчество",
          isRequired: false,
          placeholder: "пожалуйста, введите логин",
          element: {
            name: "Input",
            options: [],
            multiple: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "date_of_birth",
          label: "дата рождения",
          isRequired: false,
          placeholder: "пожалуйста, введите пароль",
          element: {
            name: "DatePicker",
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
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "email",
          label: "электронная почта",
          isRequired: false,
          placeholder: "пожалуйста, введите логин",
          element: {
            name: "Input",
            options: [],
            multiple: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "phone_number",
          label: "номер телефона",
          isRequired: false,
          placeholder: "пожалуйста, введите пароль",
          element: {
            name: "Input",
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
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "quest",
          label: "квест",
          isRequired: true,
          placeholder: "пожалуйста, выберите квест",
          element: {
            name: "Select",
            options: optionsQuests,
            multiple: false,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "roles",
          label: "роли",
          isRequired: true,
          placeholder: "пожалуйста, выберите роли",
          element: {
            name: "Select",
            options: optionsRoles,
            multiple: true,
          },
        },
      ],
    },
  ];

  return formItems;
};

// getSTQuestFormItems
export const getSTQuestFormItems = async () => {
  const optionsUsers = await fetchUsers();
  const optionsQuests = await fetchQuests();

  const formItems = [
    {
      gutter: 16,
      items: [
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "quest",
          label: "квест",
          isRequired: true,
          placeholder: "пожалуйста, выберите квест",
          element: {
            name: "Select",
            options: optionsQuests,
            multiple: null,
          },
        },
        {
          spanXS: 12,
          spanSM: 12,
          spanMD: 6,
          name: "is_package",
          label: "пакет",
          isRequired: true,
          placeholder: "да/нет",
          element: {
            name: "Checkbox",
            options: null,
            multiple: null,
          },
        },
        {
          spanXS: 12,
          spanSM: 12,
          spanMD: 6,
          name: "is_video_review",
          label: "видео отзыв",
          isRequired: true,
          placeholder: "да/нет",
          element: {
            name: "Checkbox",
            options: null,
            multiple: null,
          },
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "date",
          label: "дата",
          isRequired: true,
          placeholder: "пожалуйста, выберите дату",
          element: {
            name: "DatePicker",
            options: null,
            multiple: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "time",
          label: "время",
          isRequired: true,
          placeholder: "пожалуйста, выберите время",
          element: {
            name: "TimePicker",
            options: null,
            multiple: null,
          },
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "quest_cost",
          label: "стоимость квеста",
          isRequired: true,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Input",
            options: null,
            multiple: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "add_players",
          label: "дополнительные игроки",
          isRequired: false,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Input",
            options: null,
            multiple: null,
          },
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "actor_second_actor",
          label: "актеры/второй актер",
          isRequired: false,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Input",
            options: null,
            multiple: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "birthday_congr",
          label: "поздравление именинника",
          isRequired: false,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Input",
            options: null,
            multiple: null,
          },
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "discount_sum",
          label: "сумма скидки",
          isRequired: false,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Input",
            options: null,
            multiple: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "discount_desc",
          label: "описание скидки",
          isRequired: false,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Input",
            options: null,
            multiple: null,
          },
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "room_sum",
          label: "сумма комнат",
          isRequired: false,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Input",
            options: null,
            multiple: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "room_employee_name",
          label: "сотрудник комнаты",
          isRequired: false,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Select",
            options: optionsUsers,
            multiple: null,
          },
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "video",
          label: "сумма видео",
          isRequired: false,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Input",
            options: null,
            multiple: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "photomagnets_quantity",
          label: "количество фотомагнитов",
          isRequired: false,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Input",
            options: null,
            multiple: null,
          },
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "easy_work",
          label: "простой",
          isRequired: false,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Input",
            options: null,
            multiple: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "night_game",
          label: "ночная игра",
          isRequired: false,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Input",
            options: null,
            multiple: null,
          },
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "administrator",
          label: "администратор",
          isRequired: true,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Select",
            options: optionsUsers,
            multiple: false,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "animator",
          label: "аниматор",
          isRequired: false,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Select",
            options: optionsUsers,
            multiple: false,
          },
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "actors",
          label: "актеры",
          isRequired: false,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Select",
            options: optionsUsers,
            multiple: true,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "actors_half",
          label: "актеры (50%)",
          isRequired: false,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Select",
            options: optionsUsers,
            multiple: true,
          },
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "cash_payment",
          label: "наличный расчет",
          isRequired: false,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Input",
            options: null,
            multiple: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "cashless_payment",
          label: "безналичный расчет",
          isRequired: false,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Input",
            options: null,
            multiple: null,
          },
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "cash_delivery",
          label: "сдача наличными",
          isRequired: false,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Input",
            options: null,
            multiple: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "cashless_delivery",
          label: "сдача безналичными",
          isRequired: false,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Input",
            options: null,
            multiple: null,
          },
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 24,
          name: "prepayment",
          label: "предоплата",
          isRequired: false,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Input",
            options: null,
            multiple: null,
          },
        },
      ],
    },
  ];

  return formItems;
};

// getSTExpensesFormItems
export const getSTExpensesFormItems = async () => {
  const optionsUsers = await fetchUsers();
  const optionsQuests = await fetchQuests();
  const optionsSubCategories = await fetchSubCategories();

  const formItems = [
    {
      gutter: 16,
      items: [
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 24,
          name: "date",
          label: "дата",
          isRequired: true,
          placeholder: "пожалуйста, введите логин",
          element: {
            name: "DatePicker",
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
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "name",
          label: "наименование расхода",
          isRequired: true,
          placeholder: "пожалуйста, введите логин",
          element: {
            name: "Input",
            options: [],
            multiple: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "amount",
          label: "сумма расхода",
          isRequired: true,
          placeholder: "пожалуйста, введите пароль",
          element: {
            name: "Input",
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
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "sub_category",
          label: "подкатегория",
          isRequired: true,
          placeholder: "пожалуйста, введите логин",
          element: {
            name: "Select",
            options: optionsSubCategories,
            multiple: false,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "quests",
          label: "квесты",
          isRequired: true,
          placeholder: "пожалуйста, введите пароль",
          element: {
            name: "Select",
            options: optionsQuests,
            multiple: true,
          },
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "paid_from",
          label: "оплачено",
          isRequired: true,
          placeholder: "пожалуйста, введите логин",
          element: {
            name: "Select",
            options: optionsPaidFrom,
            multiple: false,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "who_paid",
          label: "оплатил",
          isRequired: true,
          placeholder: "пожалуйста, введите пароль",
          element: {
            name: "Select",
            options: optionsUsers,
            multiple: false,
          },
        },
      ],
    },
    // {
    //   gutter: 16,
    //   items: [
    //     {
    //       spanXS: 24,
    //       spanSM: 24,
    //       spanMD: 24,
    //       name: "attachment",
    //       label: "приложение",
    //       isRequired: true,
    //       placeholder: "пожалуйста, введите логин",
    //       element: {
    //         name: "Upload",
    //         options: [],
    //         multiple: null,
    //       },
    //     },
    //   ],
    // },
  ];

  return formItems;
};

// getSTBonusesPenaltiesFormItems
export const getSTBonusesPenaltiesFormItems = async () => {
  const optionsUsers = await fetchUsers();
  const optionsQuests = await fetchQuests();

  const formItems = [
    {
      gutter: 16,
      items: [
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "date",
          label: "дата",
          isRequired: true,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "DatePicker",
            options: null,
            multiple: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "type",
          label: "тип",
          isRequired: true,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Select",
            options: optionsTypes,
            multiple: false,
          },
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "amount",
          label: "сумма",
          isRequired: true,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Input",
            options: null,
            multiple: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "name",
          label: "описание",
          isRequired: false,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Input",
            options: null,
            multiple: null,
          },
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "user",
          label: "сотрудник",
          isRequired: true,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Select",
            options: optionsUsers,
            multiple: false,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "quests",
          label: "квесты",
          isRequired: false,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Select",
            options: optionsQuests,
            multiple: true,
          },
        },
      ],
    },
  ];

  return formItems;
};

// getQuestsFormItems
export const getQuestsFormItems = async () => {
  const optionsQuests = await fetchQuests();
  const optionsQuestVersions = await fetchQuestVersions();

  const formItems = [
    {
      gutter: 16,
      items: [
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "name",
          label: "название",
          isRequired: true,
          placeholder: "пожалуйста, введите логин",
          element: {
            name: "Input",
            options: [],
            multiple: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "address",
          label: "адрес",
          isRequired: true,
          placeholder: "пожалуйста, введите пароль",
          element: {
            name: "Input",
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
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "cost_weekdays",
          label: "стоимость квеста в будние дни",
          isRequired: true,
          placeholder: "пожалуйста, введите логин",
          element: {
            name: "Input",
            options: [],
            multiple: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "cost_weekends",
          label: "стоимость квеста в выходные дни",
          isRequired: true,
          placeholder: "пожалуйста, введите пароль",
          element: {
            name: "Input",
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
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "administrator_rate",
          label: "ставка администратора",
          isRequired: true,
          placeholder: "пожалуйста, введите логин",
          element: {
            name: "Input",
            options: [],
            multiple: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "actor_rate",
          label: "ставка актера",
          isRequired: true,
          placeholder: "пожалуйста, введите пароль",
          element: {
            name: "Input",
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
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "special_versions",
          label: "специальные версии",
          isRequired: false,
          placeholder: "пожалуйста, введите логин",
          element: {
            name: "Select",
            options: optionsQuests,
            multiple: true,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "versions",
          label: "версии",
          isRequired: false,
          placeholder: "пожалуйста, введите пароль",
          element: {
            name: "Select",
            options: optionsQuestVersions,
            multiple: true,
          },
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 24,
          name: "duration_minute",
          label: "продолжительность квеста в минутах",
          isRequired: true,
          placeholder: "пожалуйста, введите логин",
          element: {
            name: "Input",
            options: [],
            multiple: null,
          },
        },
      ],
    },
  ];

  return formItems;
};

// getQuestVersionsFormItems
export const getQuestVersionsFormItems = async () => {
  const formItems = [
    {
      gutter: 16,
      items: [
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 24,
          name: "name",
          label: "название",
          isRequired: true,
          placeholder: "пожалуйста, введите логин",
          element: {
            name: "Input",
            options: [],
            multiple: null,
          },
        },
      ],
    },
  ];

  return formItems;
};
