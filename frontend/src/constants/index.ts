// libs
import dayjs from "dayjs";

// api
import {
  getAllUsers,
  getQuestVersions,
  getQuests,
  getQuestsWithSpecVersions,
  getRoles,
  getSTExpenseCategories,
  getSTExpenseSubCategories,
  getUsers,
} from "../api/APIUtils";

export const siderWidth = 288;
export const layoutMarginLeft = siderWidth;

export const datePickerFormat = "DD.MM.YYYY";
export const rangePickerFormat = datePickerFormat;
export const timePickerFormat = "HH:mm";
export const minuteStep = 15;

const optionsNameOfExpense = [
  {
    label: "такси",
    value: "taxi",
  },
  {
    label: "ремонтные работы",
    value: "renovation_work",
  },
  {
    label: "обед",
    value: "lunch",
  },
  {
    label: "расходники",
    value: "consumables",
  },
];

const optionsOperation = [
  {
    label: "внести",
    value: "plus",
  },
  {
    label: "забрать",
    value: "minus",
  },
];

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

const fetchAllUsers = async () => {
  try {
    const res = await getAllUsers();
    if (res.status === 200) {
      const formattedOptions = res.data.map((el) => ({
        label:
          (el.last_name ? el.last_name.toLowerCase() : "") +
          " " +
          el.first_name.toLowerCase() +
          " " +
          (el.middle_name ? el.middle_name.toLowerCase() : ""),
        value: el.id,
      }));
      return formattedOptions;
    }
  } catch (error) {
    console.log(error);
  }
};
const fetchUsers = async () => {
  try {
    const res = await getUsers();
    if (res.status === 200) {
      const formattedOptions = res.data.map((el) => ({
        label:
          el.first_name.toLowerCase() + " " + el.last_name.toLowerCase(),
          // " " +
          // (el.middle_name ? el.middle_name.toLowerCase() : ""),
        value: el.id,
      }));
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
const fetchCategories = async () => {
  try {
    const res = await getSTExpenseCategories();
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
const fetchQuestsWithSpecVersions = async () => {
  try {
    const res = await getQuestsWithSpecVersions();
    if (res.status === 200) {
      const formattedOptions = res.data.map((el) => ({
        label: el.name.toLowerCase(),
        value: el.id,
      }));

      // const newArr = res.data.map((el) => {
      //   const mainQuest = {
      //     id: el.id,
      //     name: el.name
      //   }

      //   let versions = []

      //   if (el.versions.length > 0) {
      //     versions = el.versions.map((nestedEl) => ({
      //       id: nestedEl.id,
      //       name: nestedEl.name
      //     }))
      //   }

      //   return [mainQuest, ...versions]
      // })

      // const flatData = newArr.flatMap((innerArray) => innerArray);

      // const formattedOptions = flatData.map((el) => ({
      //   label: el.name.toLowerCase(),
      //   value: el.id,
      // }));

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
          name: "email",
          label: "электронная почта",
          isRequired: true,
          placeholder: "пожалуйста, введите логин",
          element: {
            name: "Input",
            options: [],
            multiple: null,
            defaultValue: null,
          },
        },
        {
          spanXS: 16,
          spanSM: 16,
          spanMD: 8,
          name: "password",
          label: "пароль",
          isRequired: false,
          placeholder: "пожалуйста, введите пароль",
          element: {
            name: "Input",
            options: [],
            multiple: null,
            defaultValue: null,
          },
        },
        {
          spanXS: 8,
          spanSM: 8,
          spanMD: 4,
          name: "is_active",
          label: "активен",
          isRequired: false,
          placeholder: "да/нет",
          element: {
            name: "Checkbox",
            options: [],
            multiple: null,
            defaultValue: null,
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
          label: "фамилия",
          isRequired: true,
          placeholder: "пожалуйста, введите пароль",
          element: {
            name: "Input",
            options: [],
            multiple: null,
            defaultValue: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "first_name",
          label: "имя",
          isRequired: true,
          placeholder: "пожалуйста, введите логин",
          element: {
            name: "Input",
            options: [],
            multiple: null,
            defaultValue: null,
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
          isRequired: true,
          placeholder: "пожалуйста, введите логин",
          element: {
            name: "Input",
            options: [],
            multiple: null,
            defaultValue: null,
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
            defaultValue: null,
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
          name: "phone_number",
          label: "номер телефона",
          isRequired: false,
          placeholder: "пожалуйста, введите пароль",
          element: {
            name: "Input",
            options: [],
            multiple: null,
            defaultValue: null,
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
            defaultValue: null,
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
          name: "quest",
          label: "квест",
          isRequired: false,
          placeholder: "пожалуйста, выберите квест",
          element: {
            name: "Select",
            options: optionsQuests,
            multiple: false,
            defaultValue: null,
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
          name: "internship_period",
          label: "промежуток стажировки",
          isRequired: false,
          placeholder: "пожалуйста, выберите квест",
          element: {
            name: "RangePicker",
            options: [],
            multiple: null,
            defaultValue: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "internship_quest",
          label: "квест стажировочные",
          isRequired: false,
          placeholder: "пожалуйста, выберите роли",
          element: {
            name: "Select",
            options: optionsQuests,
            multiple: false,
            defaultValue: null,
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
  // const optionsQuests = await fetchQuests();
  const optionsQuests = await fetchQuestsWithSpecVersions();

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
            defaultValue: null,
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
            defaultValue: null,
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
            defaultValue: null,
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
            defaultValue: dayjs(),
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
            defaultValue: dayjs().hour(9).startOf("hour"),
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
            name: "InputNumber",
            options: null,
            multiple: null,
            defaultValue: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "client_name",
          label: "имя клиента",
          isRequired: true,
          placeholder: "пожалуйста, введите имя клиента",
          element: {
            name: "Input",
            options: null,
            multiple: null,
            defaultValue: null,
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
          placeholder: "пожалуйста, выберите администратора",
          element: {
            name: "Select",
            options: optionsUsers,
            multiple: false,
            defaultValue: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "actors",
          label: "актеры",
          isRequired: false,
          placeholder: "пожалуйста, выберите актеров",
          element: {
            name: "Select",
            options: optionsUsers,
            multiple: true,
            defaultValue: null,
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
          placeholder: "пожалуйста, введите наличный расчет",
          element: {
            name: "InputNumber",
            options: null,
            multiple: null,
            defaultValue: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "cashless_payment",
          label: "безналичный расчет",
          isRequired: false,
          placeholder: "пожалуйста, введите безналичный расчет",
          element: {
            name: "InputNumber",
            options: null,
            multiple: null,
            defaultValue: null,
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
          placeholder: "пожалуйста, введите сдачу наличными",
          element: {
            name: "InputNumber",
            options: null,
            multiple: null,
            defaultValue: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "cashless_delivery",
          label: "сдача безналичными",
          isRequired: false,
          placeholder: "пожалуйста, введите сдачу безналичными",
          element: {
            name: "InputNumber",
            options: null,
            multiple: null,
            defaultValue: null,
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
          placeholder: "пожалуйста, введите предоплату",
          element: {
            name: "InputNumber",
            options: null,
            multiple: null,
            defaultValue: 500,
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
          name: "room_employee_name",
          label: "сотрудник комнаты",
          isRequired: false,
          placeholder: "пожалуйста, выберите сотрудника комнаты",
          element: {
            name: "Select",
            options: optionsUsers,
            multiple: null,
            defaultValue: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "animator",
          label: "аниматор",
          isRequired: false,
          placeholder: "пожалуйста, выберите аниматора",
          element: {
            name: "Select",
            options: optionsUsers,
            multiple: false,
            defaultValue: null,
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
          name: "actor_or_second_actor_or_animator",
          label: "актеры/второй актер/аниматор",
          isRequired: false,
          placeholder: "пожалуйста, введите актера/второго актера/аниматора",
          element: {
            name: "InputNumber",
            options: null,
            multiple: null,
            defaultValue: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "add_players",
          label: "дополнительные игроки",
          isRequired: false,
          placeholder: "пожалуйста, введите дополнительные игроки",
          element: {
            name: "InputNumber",
            options: null,
            multiple: null,
            defaultValue: null,
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
          placeholder: "пожалуйста, введите сумму комнат",
          element: {
            name: "InputNumber",
            options: null,
            multiple: null,
            defaultValue: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "video",
          label: "сумма видео",
          isRequired: false,
          placeholder: "пожалуйста, введите сумму видео",
          element: {
            name: "InputNumber",
            options: null,
            multiple: null,
            defaultValue: null,
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
          name: "night_game",
          label: "ночная игра",
          isRequired: false,
          placeholder: "пожалуйста, введите ночную игру",
          element: {
            name: "InputNumber",
            options: null,
            multiple: null,
            defaultValue: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "easy_work",
          label: "простой",
          isRequired: false,
          placeholder: "пожалуйста, введите простой",
          element: {
            name: "InputNumber",
            options: null,
            multiple: null,
            defaultValue: null,
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
          name: "birthday_congr",
          label: "поздравление именинника",
          isRequired: false,
          placeholder: "пожалуйста, введите поздравление именинника",
          element: {
            name: "InputNumber",
            options: null,
            multiple: null,
            defaultValue: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "photomagnets_quantity",
          label: "количество фотомагнитов",
          isRequired: false,
          placeholder: "пожалуйста, введите количество фотомагнитов",
          element: {
            name: "InputNumber",
            options: null,
            multiple: null,
            defaultValue: null,
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
          placeholder: "пожалуйста, введите сумму скидки",
          element: {
            name: "InputNumber",
            options: null,
            multiple: null,
            defaultValue: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "discount_desc",
          label: "описание скидки",
          isRequired: false,
          placeholder: "пожалуйста, введите описание скидки",
          element: {
            name: "Input",
            options: null,
            multiple: null,
            defaultValue: null,
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
          name: "actors_half",
          label: "актеры (50%)",
          isRequired: false,
          placeholder: "пожалуйста, выберите актеров (50%)",
          element: {
            name: "Select",
            options: optionsUsers,
            multiple: true,
            defaultValue: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "employees_first_time",
          label: "сотрудники, которые играют в первый раз",
          isRequired: false,
          placeholder: "пожалуйста, выбертие сотрудников, которые играют в первый раз",
          element: {
            name: "Select",
            options: optionsUsers,
            multiple: true,
            defaultValue: null,
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
            defaultValue: dayjs(),
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
          placeholder: "пожалуйста, выберите наименование расхода",
          element: {
            name: "Select",
            options: optionsNameOfExpense,
            multiple: null,
            defaultValue: null,
          },
        },
        // {
        //   spanXS: 24,
        //   spanSM: 24,
        //   spanMD: 12,
        //   name: "name",
        //   label: "наименование расхода",
        //   isRequired: true,
        //   placeholder: "пожалуйста, введите логин",
        //   element: {
        //     name: "Input",
        //     options: null,
        //     multiple: null,
        //     defaultValue: null,
        //   },
        // },
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
            defaultValue: null,
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
          name: "description",
          label: "описание расхода",
          isRequired: true,
          placeholder: "пожалуйста, введите логин",
          element: {
            name: "Input",
            options: null,
            multiple: null,
            defaultValue: null,
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
            defaultValue: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "quests",
          label: "квесты",
          isRequired: false,
          placeholder: "пожалуйста, введите пароль",
          element: {
            name: "Select",
            options: optionsQuests,
            multiple: true,
            defaultValue: null,
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
            defaultValue: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "who_paid",
          label: "оплатил",
          isRequired: false,
          placeholder: "пожалуйста, введите пароль",
          element: {
            name: "Select",
            options: optionsUsers,
            multiple: false,
            defaultValue: null,
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
          name: "employees",
          label: "сотрудники",
          isRequired: false,
          placeholder: "пожалуйста, введите логин",
          element: {
            name: "Select",
            options: optionsUsers,
            multiple: true,
            defaultValue: null,
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
    //       isRequired: false,
    //       placeholder: "пожалуйста, введите логин",
    //       element: {
    //         name: "Upload",
    //         options: [],
    //         multiple: null,
    //         defaultValue: null,
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
            defaultValue: null,
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
            defaultValue: null,
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
            defaultValue: null,
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
            defaultValue: null,
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
            defaultValue: null,
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
            defaultValue: null,
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
            defaultValue: null,
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
            defaultValue: null,
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
            defaultValue: null,
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
            defaultValue: null,
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
          name: "cost_weekdays_with_package",
          label: "стоимость квеста в будние дни (пакет)",
          isRequired: true,
          placeholder: "пожалуйста, введите логин",
          element: {
            name: "Input",
            options: [],
            multiple: null,
            defaultValue: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "cost_weekends_with_package",
          label: "стоимость квеста в выходные дни (пакет)",
          isRequired: true,
          placeholder: "пожалуйста, введите пароль",
          element: {
            name: "Input",
            options: [],
            multiple: null,
            defaultValue: null,
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
            defaultValue: null,
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
            defaultValue: null,
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
            defaultValue: null,
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
            defaultValue: null,
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
          name: "duration_in_minute",
          label: "продолжительность квеста в минутах",
          isRequired: true,
          placeholder: "пожалуйста, введите логин",
          element: {
            name: "Input",
            options: [],
            multiple: null,
            defaultValue: null,
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
            defaultValue: null,
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
            defaultValue: null,
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
            defaultValue: null,
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
          name: "cost_weekdays_with_package",
          label: "стоимость квеста в будние дни (пакет)",
          isRequired: true,
          placeholder: "пожалуйста, введите логин",
          element: {
            name: "Input",
            options: [],
            multiple: null,
            defaultValue: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "cost_weekends_with_package",
          label: "стоимость квеста в выходные дни (пакет)",
          isRequired: true,
          placeholder: "пожалуйста, введите пароль",
          element: {
            name: "Input",
            options: [],
            multiple: null,
            defaultValue: null,
          },
        },
      ],
    },
  ];

  return formItems;
};

// getQuestVersionsFormItems
export const getSTExpenseSubCategoriesFormItems = async () => {
  const optionsCategories = await fetchCategories();

  const formItems = [
    {
      gutter: 16,
      items: [
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 24,
          name: "name",
          label: "название подкатегории",
          isRequired: true,
          placeholder: "пожалуйста, введите логин",
          element: {
            name: "Input",
            options: [],
            multiple: null,
            defaultValue: null,
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
    //       name: "latin_name",
    //       label: "название подкатегории (en)",
    //       isRequired: true,
    //       placeholder: "пожалуйста, введите логин",
    //       element: {
    //         name: "Input",
    //         options: [],
    //         multiple: null,
    //         defaultValue: null,
    //       },
    //     },
    //   ],
    // },
    {
      gutter: 16,
      items: [
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 24,
          name: "category",
          label: "категория",
          isRequired: true,
          placeholder: "пожалуйста, введите логин",
          element: {
            name: "Select",
            options: optionsCategories,
            multiple: null,
            defaultValue: null,
          },
        },
      ],
    },
  ];

  return formItems;
};

// getSTExpenseCategoriesFormItems
export const getSTExpenseCategoriesFormItems = async () => {
  const formItems = [
    {
      gutter: 16,
      items: [
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 24,
          name: "name",
          label: "название категории",
          isRequired: true,
          placeholder: "пожалуйста, введите логин",
          element: {
            name: "Input",
            options: [],
            multiple: null,
            defaultValue: null,
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
    //       name: "latin_name",
    //       label: "название категории (en)",
    //       isRequired: true,
    //       placeholder: "пожалуйста, введите логин",
    //       element: {
    //         name: "Input",
    //         options: [],
    //         multiple: null,
    //         defaultValue: null,
    //       },
    //     },
    //   ],
    // }
  ];

  return formItems;
};

// getCashRegisterFormItems
export const getCashRegisterFormItems = async () => {
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
          isRequired: false,
          placeholder: "пожалуйста, введите пароль",
          element: {
            name: "DatePicker",
            options: [],
            multiple: null,
            defaultValue: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "operation",
          label: "операция",
          isRequired: false,
          placeholder: "пожалуйста, введите пароль",
          element: {
            name: "Select",
            options: optionsOperation,
            multiple: null,
            defaultValue: null,
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
          label: "значение",
          isRequired: false,
          placeholder: "пожалуйста, введите пароль",
          element: {
            name: "InputNumber",
            options: [],
            multiple: null,
            defaultValue: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "description",
          label: "описание",
          isRequired: false,
          placeholder: "пожалуйста, введите пароль",
          element: {
            name: "Input",
            options: [],
            multiple: null,
            defaultValue: null,
          },
        },
      ],
    },
  ];

  return formItems;
};

// getSTQuestsFormItems2
export const getSTQuestsFormItems2 = async () => {
  const optionsUsers = await fetchUsers();
  // const optionsQuests = await fetchQuests();
  // const optionsQuestVersions = await fetchQuestVersions();

  const formItems2 = [
    {
      gutter: 16,
      items: [
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "video_after",
          label: "видео после",
          isRequired: false,
          placeholder: "пожалуйста, введите логин",
          element: {
            name: "Input",
            options: [],
            multiple: null,
            defaultValue: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "photomagnets_quantity_after",
          label: "фотомагниты",
          isRequired: false,
          placeholder: "пожалуйста, введите пароль",
          element: {
            name: "Input",
            options: [],
            multiple: null,
            defaultValue: null,
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
          name: "room_sum_after",
          label: "комната дополнительно",
          isRequired: false,
          placeholder: "пожалуйста, введите логин",
          element: {
            name: "Input",
            options: [],
            multiple: null,
            defaultValue: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "room_employee_name_after",
          label: "сотрудник комнаты",
          isRequired: false,
          placeholder: "пожалуйста, введите пароль",
          element: {
            name: "Select",
            options: optionsUsers,
            multiple: false,
            defaultValue: null,
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
          name: "cash_payment_after",
          label: "наличный расчет",
          isRequired: false,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Input",
            options: null,
            multiple: null,
            defaultValue: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "cashless_payment_after",
          label: "безналичный расчет",
          isRequired: false,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Input",
            options: null,
            multiple: null,
            defaultValue: null,
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
          name: "cash_delivery_after",
          label: "сдача наличными",
          isRequired: false,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Input",
            options: null,
            multiple: null,
            defaultValue: null,
          },
        },
        {
          spanXS: 24,
          spanSM: 24,
          spanMD: 12,
          name: "cashless_delivery_after",
          label: "сдача безналичными",
          isRequired: false,
          placeholder: "пожалуйста, введите стоимость квеста",
          element: {
            name: "Input",
            options: null,
            multiple: null,
            defaultValue: null,
          },
        },
      ],
    },
  ];

  return formItems2;
};
