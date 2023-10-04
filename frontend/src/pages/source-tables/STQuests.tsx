import React, { FC, useState, useEffect } from "react";

// antd
import { Tag } from "antd";
// antd | icons
import {
  QuestionOutlined,
  FallOutlined,
  TableOutlined,
  DeploymentUnitOutlined,
} from "@ant-design/icons";

// api
import {
  deleteSTExpense,
  getSTExpenseSubCategories,
  getQuests,
  getSTExpenses,
  postSTExpense,
  getSTPenalties,
  postSTPenalty,
  deleteSTPenalty,
  getUsers,
  getSTQuests,
  postSTQuest,
  deleteSTQuest,
  getQuest,
} from "../../api/APIUtils";

// components
import TableTemplate from "../../components/TableTemplate";

const App: FC = () => {
  const [currentQuest, setCurrentQuest] = useState("");
  const [optionsUsers, setOptionsUsers] = useState([]);
  const [filtersUsers, setFiltersUsers] = useState([]);
  const [filtersQuests, setFiltersQuests] = useState([]);
  const [optionsQuests, setOptionsQuests] = useState([]);
  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      if (response.status === 200) {
        const formattedOptions = response.data.map((item) => ({
          label:
            item.last_name.toLowerCase() + " " + item.first_name.toLowerCase(),
          value: item.id,
        }));
        const formattedFilters = response.data.map((item) => ({
          text:
            item.last_name.toLowerCase() + " " + item.first_name.toLowerCase(),
          value: item.id,
        }));
        setOptionsUsers(formattedOptions);
        setFiltersUsers(formattedFilters);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchQuests = async () => {
    try {
      const response = await getQuests();
      if (response.status === 200) {
        const formattedOptions = response.data.map((item) => ({
          label: item.name.toLowerCase(),
          value: item.id,
        }));
        const formattedFilters = response.data.map((item) => ({
          text: item.name.toLowerCase(),
          value: item.id,
        }));
        setOptionsQuests(formattedOptions);
        setFiltersQuests(formattedFilters);
        // console.log(formattedFilters)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [actor_second_actor, setActor_second_actor] = useState({
    span: 8,
    name: "actor_second_actor",
    label: "актер/второй актер",
    rules: {
      required: false,
      message: "пожалуйста, введите сумму актеров/второго актера",
    },
    item: {
      name: "Input",
      picker: "",
      label: "",
      placeholder: "пожалуйста, введите сумму актеров/второго актера",
      options: [],
      multiple: null,
    },
    isShow: true,
  });

  let formItems = [
    {
      gutter: 16,
      items: [
        {
          span: 16,
          name: "quest",
          label: "квест",
          rules: {
            required: true,
            message: "пожалуйста, выберите квест",
          },
          item: {
            name: "Select",
            picker: "",
            label: "",
            placeholder: "пожалуйста, выберите квест",
            options: optionsQuests,
            multiple: null,
          },
          isShow: true,
        },
        {
          span: 8,
          name: "package",
          label: "пакет",
          rules: {
            required: false,
            message: "",
          },
          item: {
            name: "Checkbox",
            picker: "",
            label: "да/нет",
            placeholder: "",
            options: [],
            multiple: null,
          },
          isShow: true,
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          span: 12,
          name: "date",
          label: "дата",
          rules: {
            required: true,
            message: "пожалуйста, выберите дату",
          },
          item: {
            name: "DatePicker",
            picker: "",
            label: "",
            placeholder: "",
            options: [],
            multiple: null,
          },
          isShow: true,
        },
        {
          span: 12,
          name: "time",
          label: "время",
          rules: {
            required: true,
            message: "пожалуйста, выберите время",
          },
          item: {
            name: "TimePicker",
            picker: "time",
            label: "",
            placeholder: "",
            options: [],
            multiple: null,
          },
          isShow: true,
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          span: 8,
          name: "quest_cost",
          label: "стоимость квеста",
          rules: {
            required: true,
            message: "пожалуйста, введите стоимость квеста",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите стоимость квеста",
            options: [],
            multiple: null,
          },
          isShow: true,
        },
        {
          span: 8,
          name: "add_players",
          label: "дополнительные игроки",
          rules: {
            required: false,
            message: "пожалуйста, введите сумму за дополнительных игроков",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите сумму за дополнительных игроков",
            options: [],
            multiple: null,
          },
          isShow: true,
        },
        actor_second_actor,
      ],
    },
    {
      gutter: 16,
      items: [
        {
          span: 12,
          name: "discount_sum",
          label: "сумма скидки",
          rules: {
            required: false,
            message: "пожалуйста, введите сумму скидки",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите сумму скидки",
            options: [],
            multiple: null,
          },
          isShow: true,
        },
        {
          span: 12,
          name: "discount_desc",
          label: "описание скидки",
          rules: {
            required: false,
            message: "пожалуйста, введите описание скидки",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите описание скидки",
            options: [],
            multiple: null,
          },
          isShow: true,
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          span: 8,
          name: "room_sum",
          label: "сумма комнат",
          rules: {
            required: false,
            message: "пожалуйста, введите сумму комнат",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите сумму комнат",
            options: [],
            multiple: null,
          },
          isShow: true,
        },
        // {
        //   span: 8,
        //   name: "room_quantity",
        //   label: "количество комнат",
        //   rules: {
        //     required: false,
        //     message: "пожалуйста, введите количество комнат",
        //   },
        //   item: {
        //     name: "Input",
        //     picker: "",
        //     label: "",
        //     placeholder: "пожалуйста, введите количество комнат",
        //     options: [],
        //     multiple: null,
        //   },
        // },
        {
          span: 8,
          name: "room_employee_name",
          label: "сотрудник комнаты",
          rules: {
            required: false,
            message: "пожалуйста, выберите сотрудника комнаты",
          },
          item: {
            name: "Select",
            picker: "",
            label: "",
            placeholder: "пожалуйста, выберите сотрудника комнаты",
            options: optionsUsers,
            multiple: false,
          },
          isShow: true,
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          span: 8,
          name: "video",
          label: "сумма видео",
          rules: {
            required: false,
            message: "пожалуйста, введите сумму видео",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите сумму видео",
            options: [],
            multiple: null,
          },
          isShow: true,
        },
        {
          span: 8,
          name: "photomagnets_quantity",
          label: "количество фотомагнитов",
          rules: {
            required: false,
            message: "пожалуйста, введите количество фотомагнитов",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите количество фотомагнитов",
            options: [],
            multiple: null,
          },
          isShow: true,
        },
        {
          span: 8,
          name: "birthday_congr",
          label: "поздравление именинника",
          rules: {
            required: false,
            message: "пожалуйста, введите сумму поздравления именинника",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите сумму поздравления именинника",
            options: [],
            multiple: null,
          },
          isShow: true,
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          span: 12,
          name: "easy_work",
          label: "простой",
          rules: {
            required: false,
            message: "пожалуйста, введите сумму простоя",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите сумму простоя",
            options: [],
            multiple: null,
          },
          isShow: true,
        },
        {
          span: 12,
          name: "night_game",
          label: "ночная игра",
          rules: {
            required: false,
            message: "пожалуйста, введите сумму ночной игры",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите сумму ночной игры",
            options: [],
            multiple: null,
          },
          isShow: true,
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          span: 12,
          name: "administrator",
          label: "администратор",
          rules: {
            required: false,
            message: "пожалуйста, выберите администратора",
          },
          item: {
            name: "Select",
            picker: "",
            label: "",
            placeholder: "пожалуйста, выберите администратора",
            options: optionsUsers,
            multiple: false,
          },
          isShow: true,
        },
        {
          span: 12,
          name: "animator",
          label: "аниматор",
          rules: {
            required: false,
            message: "пожалуйста, выберите аниматора",
          },
          item: {
            name: "Select",
            picker: "",
            label: "",
            placeholder: "пожалуйста, выберите аниматора",
            options: optionsUsers,
            multiple: false,
          },
          isShow: true,
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          span: 12,
          name: "actors",
          label: "актеры",
          rules: {
            required: false,
            message: "пожалуйста, выберите актеров",
          },
          item: {
            name: "Select",
            picker: "",
            label: "",
            placeholder: "пожалуйста, выберите актеров",
            options: optionsUsers,
            multiple: true,
          },
          isShow: true,
        },
        {
          span: 12,
          name: "actors_half",
          label: "актеры (50%)",
          rules: {
            required: false,
            message: "пожалуйста, выберите актеров (50%)",
          },
          item: {
            name: "Select",
            picker: "",
            label: "",
            placeholder: "пожалуйста, выберите актеров (50%)",
            options: optionsUsers,
            multiple: true,
          },
          isShow: true,
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          span: 12,
          name: "cash_payment",
          label: "наличный расчет",
          rules: {
            required: false,
            message: "пожалуйста, введите сумму наличного расчета",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите сумму наличного расчета",
            options: [],
            multiple: null,
          },
          isShow: true,
        },
        {
          span: 12,
          name: "cashless_payment",
          label: "безналичный расчет",
          rules: {
            required: false,
            message: "пожалуйста, введите сумму безналичного расчета",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите сумму безналичного расчета",
            options: [],
            multiple: null,
          },
          isShow: true,
        },
      ],
    },
    {
      gutter: 16,
      items: [
        {
          span: 12,
          name: "cash_delivery",
          label: "сдача наличными",
          rules: {
            required: false,
            message: "пожалуйста, введите сумму сдачи наличными",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите сумму сдачи наличными",
            options: [],
            multiple: null,
          },
          isShow: true,
        },
        {
          span: 12,
          name: "cashless_delivery",
          label: "сдача безналичными",
          rules: {
            required: false,
            message: "пожалуйста, введите сумму сдачи безналичными",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите сумму сдачи безналичными",
            options: [],
            multiple: null,
          },
          isShow: true,
        },
      ],
    },
    {
      gutter: 16,
      items: [
        // {
        //   span: 12,
        //   name: "package",
        //   label: "пакет",
        //   rules: {
        //     required: false,
        //     message: "",
        //   },
        //   item: {
        //     name: "Checkbox",
        //     picker: "",
        //     label: "да/нет",
        //     placeholder: "",
        //     options: [],
        //     multiple: null,
        //   },
        // },
        // {
        //   span: 6,
        //   name: "travel",
        //   label: "проезд",
        //   rules: {
        //     required: false,
        //     message: "",
        //   },
        //   item: {
        //     name: "Checkbox",
        //     picker: "",
        //     label: "да/нет",
        //     placeholder: "",
        //     options: [],
        //     multiple: null,
        //   },
        // },
        {
          span: 12,
          name: "prepayment",
          label: "предоплата",
          rules: {
            required: false,
            message: "пожалуйста, введите сумму предоплаты",
          },
          item: {
            name: "Input",
            picker: "",
            label: "",
            placeholder: "пожалуйста, введите сумму предоплаты",
            options: [],
            multiple: null,
          },
          isShow: true,
        },
      ],
    },
  ];

  const checkboxOnChange = async (e) => {
    if (e.target.checked) {
      console.log("checked");
      setFormItems([
        {
          gutter: 16,
          items: [
            {
              span: 16,
              name: "quest",
              label: "квест",
              rules: {
                required: true,
                message: "пожалуйста, выберите квест",
              },
              item: {
                name: "Select",
                picker: "",
                label: "",
                placeholder: "пожалуйста, выберите квест",
                options: optionsQuests,
                multiple: null,
              },
              isShow: true,
            },
            {
              span: 8,
              name: "package",
              label: "пакет",
              rules: {
                required: false,
                message: "",
              },
              item: {
                name: "Checkbox",
                picker: "",
                label: "да/нет",
                placeholder: "",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
          ],
        },
        {
          gutter: 16,
          items: [
            {
              span: 12,
              name: "date",
              label: "дата",
              rules: {
                required: true,
                message: "пожалуйста, выберите дату",
              },
              item: {
                name: "DatePicker",
                picker: "",
                label: "",
                placeholder: "",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
            {
              span: 12,
              name: "time",
              label: "время",
              rules: {
                required: true,
                message: "пожалуйста, выберите время",
              },
              item: {
                name: "TimePicker",
                picker: "time",
                label: "",
                placeholder: "",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
          ],
        },
        {
          gutter: 16,
          items: [
            {
              span: 8,
              name: "quest_cost",
              label: "стоимость квеста",
              rules: {
                required: true,
                message: "пожалуйста, введите стоимость квеста",
              },
              item: {
                name: "Input",
                picker: "",
                label: "",
                placeholder: "пожалуйста, введите стоимость квеста",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
            {
              span: 8,
              name: "add_players",
              label: "дополнительные игроки",
              rules: {
                required: false,
                message: "пожалуйста, введите сумму за дополнительных игроков",
              },
              item: {
                name: "Input",
                picker: "",
                label: "",
                placeholder:
                  "пожалуйста, введите сумму за дополнительных игроков",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
            actor_second_actor,
          ],
        },
        {
          gutter: 16,
          items: [
            {
              span: 12,
              name: "discount_sum",
              label: "сумма скидки",
              rules: {
                required: false,
                message: "пожалуйста, введите сумму скидки",
              },
              item: {
                name: "Input",
                picker: "",
                label: "",
                placeholder: "пожалуйста, введите сумму скидки",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
            {
              span: 12,
              name: "discount_desc",
              label: "описание скидки",
              rules: {
                required: false,
                message: "пожалуйста, введите описание скидки",
              },
              item: {
                name: "Input",
                picker: "",
                label: "",
                placeholder: "пожалуйста, введите описание скидки",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
          ],
        },
        {
          gutter: 16,
          items: [
            {
              span: 8,
              name: "room_sum",
              label: "сумма комнат",
              rules: {
                required: false,
                message: "пожалуйста, введите сумму комнат",
              },
              item: {
                name: "Input",
                picker: "",
                label: "",
                placeholder: "пожалуйста, введите сумму комнат",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
            // {
            //   span: 8,
            //   name: "room_quantity",
            //   label: "количество комнат",
            //   rules: {
            //     required: false,
            //     message: "пожалуйста, введите количество комнат",
            //   },
            //   item: {
            //     name: "Input",
            //     picker: "",
            //     label: "",
            //     placeholder: "пожалуйста, введите количество комнат",
            //     options: [],
            //     multiple: null,
            //   },
            // },
            {
              span: 8,
              name: "room_employee_name",
              label: "сотрудник комнаты",
              rules: {
                required: false,
                message: "пожалуйста, выберите сотрудника комнаты",
              },
              item: {
                name: "Select",
                picker: "",
                label: "",
                placeholder: "пожалуйста, выберите сотрудника комнаты",
                options: optionsUsers,
                multiple: false,
              },
              isShow: true,
            },
          ],
        },
        {
          gutter: 16,
          items: [
            {
              span: 8,
              name: "photomagnets_quantity",
              label: "количество фотомагнитов",
              rules: {
                required: false,
                message: "пожалуйста, введите количество фотомагнитов",
              },
              item: {
                name: "Input",
                picker: "",
                label: "",
                placeholder: "пожалуйста, введите количество фотомагнитов",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
          ],
        },
        {
          gutter: 16,
          items: [
            {
              span: 12,
              name: "easy_work",
              label: "простой",
              rules: {
                required: false,
                message: "пожалуйста, введите сумму простоя",
              },
              item: {
                name: "Input",
                picker: "",
                label: "",
                placeholder: "пожалуйста, введите сумму простоя",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
            {
              span: 12,
              name: "night_game",
              label: "ночная игра",
              rules: {
                required: false,
                message: "пожалуйста, введите сумму ночной игры",
              },
              item: {
                name: "Input",
                picker: "",
                label: "",
                placeholder: "пожалуйста, введите сумму ночной игры",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
          ],
        },
        {
          gutter: 16,
          items: [
            {
              span: 12,
              name: "administrator",
              label: "администратор",
              rules: {
                required: false,
                message: "пожалуйста, выберите администратора",
              },
              item: {
                name: "Select",
                picker: "",
                label: "",
                placeholder: "пожалуйста, выберите администратора",
                options: optionsUsers,
                multiple: false,
              },
              isShow: true,
            },
            {
              span: 12,
              name: "animator",
              label: "аниматор",
              rules: {
                required: false,
                message: "пожалуйста, выберите аниматора",
              },
              item: {
                name: "Select",
                picker: "",
                label: "",
                placeholder: "пожалуйста, выберите аниматора",
                options: optionsUsers,
                multiple: false,
              },
              isShow: true,
            },
          ],
        },
        {
          gutter: 16,
          items: [
            {
              span: 12,
              name: "actors",
              label: "актеры",
              rules: {
                required: false,
                message: "пожалуйста, выберите актеров",
              },
              item: {
                name: "Select",
                picker: "",
                label: "",
                placeholder: "пожалуйста, выберите актеров",
                options: optionsUsers,
                multiple: true,
              },
              isShow: true,
            },
            {
              span: 12,
              name: "actors_half",
              label: "актеры (50%)",
              rules: {
                required: false,
                message: "пожалуйста, выберите актеров (50%)",
              },
              item: {
                name: "Select",
                picker: "",
                label: "",
                placeholder: "пожалуйста, выберите актеров (50%)",
                options: optionsUsers,
                multiple: true,
              },
              isShow: true,
            },
          ],
        },
        {
          gutter: 16,
          items: [
            {
              span: 12,
              name: "cash_payment",
              label: "наличный расчет",
              rules: {
                required: false,
                message: "пожалуйста, введите сумму наличного расчета",
              },
              item: {
                name: "Input",
                picker: "",
                label: "",
                placeholder: "пожалуйста, введите сумму наличного расчета",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
            {
              span: 12,
              name: "cashless_payment",
              label: "безналичный расчет",
              rules: {
                required: false,
                message: "пожалуйста, введите сумму безналичного расчета",
              },
              item: {
                name: "Input",
                picker: "",
                label: "",
                placeholder: "пожалуйста, введите сумму безналичного расчета",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
          ],
        },
        {
          gutter: 16,
          items: [
            {
              span: 12,
              name: "cash_delivery",
              label: "сдача наличными",
              rules: {
                required: false,
                message: "пожалуйста, введите сумму сдачи наличными",
              },
              item: {
                name: "Input",
                picker: "",
                label: "",
                placeholder: "пожалуйста, введите сумму сдачи наличными",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
            {
              span: 12,
              name: "cashless_delivery",
              label: "сдача безналичными",
              rules: {
                required: false,
                message: "пожалуйста, введите сумму сдачи безналичными",
              },
              item: {
                name: "Input",
                picker: "",
                label: "",
                placeholder: "пожалуйста, введите сумму сдачи безналичными",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
          ],
        },
        {
          gutter: 16,
          items: [
            // {
            //   span: 12,
            //   name: "package",
            //   label: "пакет",
            //   rules: {
            //     required: false,
            //     message: "",
            //   },
            //   item: {
            //     name: "Checkbox",
            //     picker: "",
            //     label: "да/нет",
            //     placeholder: "",
            //     options: [],
            //     multiple: null,
            //   },
            // },
            // {
            //   span: 6,
            //   name: "travel",
            //   label: "проезд",
            //   rules: {
            //     required: false,
            //     message: "",
            //   },
            //   item: {
            //     name: "Checkbox",
            //     picker: "",
            //     label: "да/нет",
            //     placeholder: "",
            //     options: [],
            //     multiple: null,
            //   },
            // },
            {
              span: 12,
              name: "prepayment",
              label: "предоплата",
              rules: {
                required: false,
                message: "пожалуйста, введите сумму предоплаты",
              },
              item: {
                name: "Input",
                picker: "",
                label: "",
                placeholder: "пожалуйста, введите сумму предоплаты",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
          ],
        },
      ]);
    } else {
      setFormItems([
        {
          gutter: 16,
          items: [
            {
              span: 16,
              name: "quest",
              label: "квест",
              rules: {
                required: true,
                message: "пожалуйста, выберите квест",
              },
              item: {
                name: "Select",
                picker: "",
                label: "",
                placeholder: "пожалуйста, выберите квест",
                options: optionsQuests,
                multiple: null,
              },
              isShow: true,
            },
            {
              span: 8,
              name: "package",
              label: "пакет",
              rules: {
                required: false,
                message: "",
              },
              item: {
                name: "Checkbox",
                picker: "",
                label: "да/нет",
                placeholder: "",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
          ],
        },
        {
          gutter: 16,
          items: [
            {
              span: 12,
              name: "date",
              label: "дата",
              rules: {
                required: true,
                message: "пожалуйста, выберите дату",
              },
              item: {
                name: "DatePicker",
                picker: "",
                label: "",
                placeholder: "",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
            {
              span: 12,
              name: "time",
              label: "время",
              rules: {
                required: true,
                message: "пожалуйста, выберите время",
              },
              item: {
                name: "TimePicker",
                picker: "time",
                label: "",
                placeholder: "",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
          ],
        },
        {
          gutter: 16,
          items: [
            {
              span: 8,
              name: "quest_cost",
              label: "стоимость квеста",
              rules: {
                required: true,
                message: "пожалуйста, введите стоимость квеста",
              },
              item: {
                name: "Input",
                picker: "",
                label: "",
                placeholder: "пожалуйста, введите стоимость квеста",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
            {
              span: 8,
              name: "add_players",
              label: "дополнительные игроки",
              rules: {
                required: false,
                message: "пожалуйста, введите сумму за дополнительных игроков",
              },
              item: {
                name: "Input",
                picker: "",
                label: "",
                placeholder:
                  "пожалуйста, введите сумму за дополнительных игроков",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
            actor_second_actor,
          ],
        },
        {
          gutter: 16,
          items: [
            {
              span: 12,
              name: "discount_sum",
              label: "сумма скидки",
              rules: {
                required: false,
                message: "пожалуйста, введите сумму скидки",
              },
              item: {
                name: "Input",
                picker: "",
                label: "",
                placeholder: "пожалуйста, введите сумму скидки",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
            {
              span: 12,
              name: "discount_desc",
              label: "описание скидки",
              rules: {
                required: false,
                message: "пожалуйста, введите описание скидки",
              },
              item: {
                name: "Input",
                picker: "",
                label: "",
                placeholder: "пожалуйста, введите описание скидки",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
          ],
        },
        {
          gutter: 16,
          items: [
            {
              span: 8,
              name: "room_sum",
              label: "сумма комнат",
              rules: {
                required: false,
                message: "пожалуйста, введите сумму комнат",
              },
              item: {
                name: "Input",
                picker: "",
                label: "",
                placeholder: "пожалуйста, введите сумму комнат",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
            // {
            //   span: 8,
            //   name: "room_quantity",
            //   label: "количество комнат",
            //   rules: {
            //     required: false,
            //     message: "пожалуйста, введите количество комнат",
            //   },
            //   item: {
            //     name: "Input",
            //     picker: "",
            //     label: "",
            //     placeholder: "пожалуйста, введите количество комнат",
            //     options: [],
            //     multiple: null,
            //   },
            // },
            {
              span: 8,
              name: "room_employee_name",
              label: "сотрудник комнаты",
              rules: {
                required: false,
                message: "пожалуйста, выберите сотрудника комнаты",
              },
              item: {
                name: "Select",
                picker: "",
                label: "",
                placeholder: "пожалуйста, выберите сотрудника комнаты",
                options: optionsUsers,
                multiple: false,
              },
              isShow: true,
            },
          ],
        },
        {
          gutter: 16,
          items: [
            {
              span: 8,
              name: "video",
              label: "сумма видео",
              rules: {
                required: false,
                message: "пожалуйста, введите сумму видео",
              },
              item: {
                name: "Input",
                picker: "",
                label: "",
                placeholder: "пожалуйста, введите сумму видео",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
            {
              span: 8,
              name: "photomagnets_quantity",
              label: "количество фотомагнитов",
              rules: {
                required: false,
                message: "пожалуйста, введите количество фотомагнитов",
              },
              item: {
                name: "Input",
                picker: "",
                label: "",
                placeholder: "пожалуйста, введите количество фотомагнитов",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
            {
              span: 8,
              name: "birthday_congr",
              label: "поздравление именинника",
              rules: {
                required: false,
                message: "пожалуйста, введите сумму поздравления именинника",
              },
              item: {
                name: "Input",
                picker: "",
                label: "",
                placeholder:
                  "пожалуйста, введите сумму поздравления именинника",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
          ],
        },
        {
          gutter: 16,
          items: [
            {
              span: 12,
              name: "easy_work",
              label: "простой",
              rules: {
                required: false,
                message: "пожалуйста, введите сумму простоя",
              },
              item: {
                name: "Input",
                picker: "",
                label: "",
                placeholder: "пожалуйста, введите сумму простоя",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
            {
              span: 12,
              name: "night_game",
              label: "ночная игра",
              rules: {
                required: false,
                message: "пожалуйста, введите сумму ночной игры",
              },
              item: {
                name: "Input",
                picker: "",
                label: "",
                placeholder: "пожалуйста, введите сумму ночной игры",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
          ],
        },
        {
          gutter: 16,
          items: [
            {
              span: 12,
              name: "administrator",
              label: "администратор",
              rules: {
                required: false,
                message: "пожалуйста, выберите администратора",
              },
              item: {
                name: "Select",
                picker: "",
                label: "",
                placeholder: "пожалуйста, выберите администратора",
                options: optionsUsers,
                multiple: false,
              },
              isShow: true,
            },
            {
              span: 12,
              name: "animator",
              label: "аниматор",
              rules: {
                required: false,
                message: "пожалуйста, выберите аниматора",
              },
              item: {
                name: "Select",
                picker: "",
                label: "",
                placeholder: "пожалуйста, выберите аниматора",
                options: optionsUsers,
                multiple: false,
              },
              isShow: true,
            },
          ],
        },
        {
          gutter: 16,
          items: [
            {
              span: 12,
              name: "actors",
              label: "актеры",
              rules: {
                required: false,
                message: "пожалуйста, выберите актеров",
              },
              item: {
                name: "Select",
                picker: "",
                label: "",
                placeholder: "пожалуйста, выберите актеров",
                options: optionsUsers,
                multiple: true,
              },
              isShow: true,
            },
            {
              span: 12,
              name: "actors_half",
              label: "актеры (50%)",
              rules: {
                required: false,
                message: "пожалуйста, выберите актеров (50%)",
              },
              item: {
                name: "Select",
                picker: "",
                label: "",
                placeholder: "пожалуйста, выберите актеров (50%)",
                options: optionsUsers,
                multiple: true,
              },
              isShow: true,
            },
          ],
        },
        {
          gutter: 16,
          items: [
            {
              span: 12,
              name: "cash_payment",
              label: "наличный расчет",
              rules: {
                required: false,
                message: "пожалуйста, введите сумму наличного расчета",
              },
              item: {
                name: "Input",
                picker: "",
                label: "",
                placeholder: "пожалуйста, введите сумму наличного расчета",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
            {
              span: 12,
              name: "cashless_payment",
              label: "безналичный расчет",
              rules: {
                required: false,
                message: "пожалуйста, введите сумму безналичного расчета",
              },
              item: {
                name: "Input",
                picker: "",
                label: "",
                placeholder: "пожалуйста, введите сумму безналичного расчета",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
          ],
        },
        {
          gutter: 16,
          items: [
            {
              span: 12,
              name: "cash_delivery",
              label: "сдача наличными",
              rules: {
                required: false,
                message: "пожалуйста, введите сумму сдачи наличными",
              },
              item: {
                name: "Input",
                picker: "",
                label: "",
                placeholder: "пожалуйста, введите сумму сдачи наличными",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
            {
              span: 12,
              name: "cashless_delivery",
              label: "сдача безналичными",
              rules: {
                required: false,
                message: "пожалуйста, введите сумму сдачи безналичными",
              },
              item: {
                name: "Input",
                picker: "",
                label: "",
                placeholder: "пожалуйста, введите сумму сдачи безналичными",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
          ],
        },
        {
          gutter: 16,
          items: [
            // {
            //   span: 12,
            //   name: "package",
            //   label: "пакет",
            //   rules: {
            //     required: false,
            //     message: "",
            //   },
            //   item: {
            //     name: "Checkbox",
            //     picker: "",
            //     label: "да/нет",
            //     placeholder: "",
            //     options: [],
            //     multiple: null,
            //   },
            // },
            // {
            //   span: 6,
            //   name: "travel",
            //   label: "проезд",
            //   rules: {
            //     required: false,
            //     message: "",
            //   },
            //   item: {
            //     name: "Checkbox",
            //     picker: "",
            //     label: "да/нет",
            //     placeholder: "",
            //     options: [],
            //     multiple: null,
            //   },
            // },
            {
              span: 12,
              name: "prepayment",
              label: "предоплата",
              rules: {
                required: false,
                message: "пожалуйста, введите сумму предоплаты",
              },
              item: {
                name: "Input",
                picker: "",
                label: "",
                placeholder: "пожалуйста, введите сумму предоплаты",
                options: [],
                multiple: null,
              },
              isShow: true,
            },
          ],
        },
      ]);
    }
  };

  const handleChange = async (value: any) => {
    const response = await getQuest(value);
    const questName = response.data.name;

    setCurrentQuest(questName);

    if (questName === "Радуга") {
      setActor_second_actor({
        span: 8,
        name: "actor_second_actor",
        label: "актер/аниматор",
        rules: {
          required: false,
          message: "пожалуйста, введите сумму актеров/второго актера",
        },
        item: {
          name: "Input",
          picker: "",
          label: "",
          placeholder: "пожалуйста, введите сумму актеров/второго актера",
          options: [],
          multiple: null,
        },
        isShow: true,
      });
    } else if (questName === "Тьма") {
      setActor_second_actor({
        span: 8,
        name: "actor_second_actor",
        label: "второй актер",
        rules: {
          required: false,
          message: "пожалуйста, введите сумму актеров/второго актера",
        },
        item: {
          name: "Input",
          picker: "",
          label: "",
          placeholder: "пожалуйста, введите сумму актеров/второго актера",
          options: [],
          multiple: null,
        },
        isShow: true,
      });
    }
  };

  const sourceBreadcrumbItems = [
    {
      icon: TableOutlined,
      title: "исходные таблицы",
      to: "/source-tables",
    },
    {
      icon: FallOutlined,
      title: "квесты",
      menu: [
        {
          key: "1",
          icon: QuestionOutlined,
          label: "квесты",
          to: "/source-tables/quests",
        },
        {
          key: "2",
          icon: FallOutlined,
          label: "расходы",
          to: "/source-tables/expenses",
        },
        {
          key: "3",
          icon: DeploymentUnitOutlined,
          label: "бонусы",
          to: "/source-tables/bonuses",
        },
        {
          key: "4",
          icon: DeploymentUnitOutlined,
          label: "штрафы",
          to: "/source-tables/penalties",
        },
      ],
    },
  ];

  const initialPackedTableColumns = [
    {
      title: "дата/время",
      dataIndex: "date_time",
      key: "date_time",
      sorting: {
        isSorting: false,
        isDate: false,
      },
      searching: {
        isSearching: false,
        title: "",
      },
      countable: false,
      width: 140,
      fixed: "left",
    },
    {
      title: "квест",
      dataIndex: "quest",
      key: "quest",
      filters: filtersQuests,
      onFilter: (value: string, record) => record.quest.name.startsWith(value),
      filterSearch: true,
      sorting: {
        isSorting: false,
        isDate: false,
      },
      searching: {
        isSearching: false,
        title: "",
      },
      countable: false,
      render: (quest) => <Tag color="orange">{quest.name}</Tag>,
    },
    {
      title: "стоимость квеста",
      dataIndex: "quest_cost",
      key: "quest_cost",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "",
      },
      countable: true,
    },
    {
      title: "дополнительные игороки",
      dataIndex: "add_players",
      key: "add_players",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "",
      },
      countable: true,
    },
    {
      title: "актеры/второй актер",
      dataIndex: "actor_second_actor",
      key: "actor_second_actor",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "",
      },
      countable: true,
    },
    {
      title: "сумма скидки",
      dataIndex: "discount_sum",
      key: "discount_sum",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "",
      },
      countable: true,
    },
    {
      title: "описание скидки",
      dataIndex: "discount_desc",
      key: "discount_desc",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "",
      },
      countable: false,
    },
    {
      title: "сумма комнат",
      dataIndex: "room_sum",
      key: "room_sum",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "",
      },
      countable: true,
    },
    // {
    //   title: "количество комнат",
    //   dataIndex: "room_quantity",
    //   key: "room_quantity",
    //   sorting: {
    //     isSorting: true,
    //     isDate: false,
    //   },
    //   searching: {
    //     isSearching: true,
    //     title: "",
    //   },
    //   countable: true,
    // },
    {
      title: "сотрудник комнаты",
      dataIndex: "room_employee_name",
      key: "room_employee_name",
      sorting: {
        isSorting: false,
        isDate: false,
      },
      searching: {
        isSearching: false,
        title: "",
      },
      countable: false,
    },
    {
      title: "сумма видео",
      dataIndex: "video",
      key: "video",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "",
      },
      countable: true,
    },
    {
      title: "сумма фотомагнитов",
      dataIndex: "photomagnets_sum",
      key: "photomagnets_sum",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "",
      },
      countable: true,
    },
    {
      title: "количество фотомагнитов",
      dataIndex: "photomagnets_quantity",
      key: "photomagnets_quantity",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "",
      },
      countable: true,
    },
    {
      title: "поздравление именинника",
      dataIndex: "birthday_congr",
      key: "birthday_congr",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "",
      },
      countable: true,
    },
    {
      title: "сумма простоя",
      dataIndex: "easy_work",
      key: "easy_work",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "",
      },
      countable: true,
    },
    {
      title: "сумма ночной игры",
      dataIndex: "night_game",
      key: "night_game",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "",
      },
      countable: true,
    },
    {
      title: "администратор",
      dataIndex: "administrator",
      key: "administrator",
      filters: filtersUsers,
      onFilter: (value: string, record) =>
        record.administrator.startsWith(value),
      filterSearch: true,
      sorting: {
        isSorting: false,
        isDate: false,
      },
      searching: {
        isSearching: false,
        title: "",
      },
      countable: false,
      render: (user) => (
        <Tag color="black">
          {user.last_name} {user.first_name}
        </Tag>
      ),
    },
    {
      title: "актеры",
      dataIndex: "actors",
      key: "actors",
      filters: filtersUsers,
      onFilter: (value, record) => record.actors.includes(value),
      filterSearch: true,
      filterMultiple: true,
      sorting: {
        isSorting: false,
        isDate: false,
      },
      searching: {
        isSearching: false,
        title: "",
      },
      countable: false,
      render: (_, { actors }) => (
        <>
          {actors.map((actor) => {
            return (
              <Tag color="black" key={actor.id}>
                {actor.last_name} {actor.first_name}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "актеры (50%)",
      dataIndex: "actors_half",
      key: "actors_half",
      filters: filtersUsers,
      onFilter: (value, record) => record.actors_half.includes(value),
      filterSearch: true,
      filterMultiple: true,
      sorting: {
        isSorting: false,
        isDate: false,
      },
      searching: {
        isSearching: false,
        title: "",
      },
      countable: false,
      render: (_, { actors_half }) => (
        <>
          {actors_half.map((actor_half) => {
            return (
              <Tag color="black" key={actor_half.id}>
                {actor_half.last_name} {actor_half.first_name}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "аниматор",
      dataIndex: "animator",
      key: "animator",
      filters: filtersUsers,
      onFilter: (value: string, record) => record.animator.startsWith(value),
      filterSearch: true,
      sorting: {
        isSorting: false,
        isDate: false,
      },
      searching: {
        isSearching: false,
        title: "",
      },
      countable: false,
      render: (user) => (
        <Tag color="black">
          {user.last_name} {user.first_name}
        </Tag>
      ),
    },
    {
      title: "пакет",
      dataIndex: "package",
      key: "package",
      sorting: {
        isSorting: false,
        isDate: false,
      },
      searching: {
        isSearching: false,
        title: "",
      },
      countable: false,
      render: (package1) => {
        let color = "red";
        let formattedPackage = "нет";

        if (package1) {
          color = "green";
          formattedPackage = "да";
        } else {
          color = "red";
          formattedPackage = "нет";
        }

        return <Tag color={color}>{formattedPackage}</Tag>;
      },
    },
    {
      title: "наличный расчет",
      dataIndex: "night_game",
      key: "night_game",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "",
      },
      countable: true,
    },
    {
      title: "безналичный расчет",
      dataIndex: "cashless_payment",
      key: "cashless_payment",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "",
      },
      countable: true,
    },
    {
      title: "сдача наличными",
      dataIndex: "cash_delivery",
      key: "cash_delivery",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "",
      },
      countable: true,
    },
    {
      title: "сдача безналичными",
      dataIndex: "cashless_delivery",
      key: "cashless_delivery",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "",
      },
      countable: true,
    },
    {
      title: "предоплата",
      dataIndex: "prepayment",
      key: "prepayment",
      sorting: {
        isSorting: true,
        isDate: false,
      },
      searching: {
        isSearching: true,
        title: "",
      },
      countable: true,
    },
  ];

  useEffect(() => {
    fetchUsers();
    fetchQuests();
  }, []);

  return (
    <TableTemplate
      defaultOpenKeys={["sourceTables"]}
      defaultSelectedKeys={["sourceTablesQuests"]}
      breadcrumbItems={sourceBreadcrumbItems}
      title={"исходные таблицы | квесты"}
      datePicker={true}
      addEntry={true}
      addEntryTitle={"новая запись"}
      fetchFunction={getSTQuests}
      createFunction={postSTQuest}
      deleteFunction={deleteSTQuest}
      initialPackedTableColumns={initialPackedTableColumns}
      tableScroll={{ x: 5000 }}
      tableOperation={true}
      tableBordered={true}
      drawerTitle="создать новую запись"
      formItems={formItems}
      handleChange={handleChange}
      checkboxOnChange={checkboxOnChange}
    />
  );
};

export default App;
