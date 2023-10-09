import { useState, useEffect } from "react";

// api
import { getQuests } from "../api/APIUtils";

// contants
import { stquestsFormItems } from "../constants";


interface Quest {
  // Define your quest properties here
  id: number;
  name: string;
  // Add other properties as needed
}

interface FormValues {
  quest_cost: number;
  // Define other form values here
}

interface QuestFormState {
  quests: Quest[];
  selectedQuest: Quest;
  isPackage: boolean;
  isWeekend: boolean | null;
  notVisibleFormItems: string[];
  defaultValuesFormItems: FormValues;
}

const useQuestForm = (): QuestFormState => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [selectedQuest, setSelectedQuest] = useState<Quest>({
    id: 0,
    name: "",
  });
  const [isPackage, setIsPackage] = useState(false);
  const [isWeekend, setIsWeekend] = useState<boolean | null>(null);
  const [notVisibleFormItems, setNotVisibleFormItems] = useState<string[]>([]);
  const [defaultValuesFormItems, setDefaultValuesFormItems] =
    useState<FormValues>({
      quest_cost: 0,
      // Initialize other form values as needed
    });

  const formHandleOnChange = (value: any, name: string) => {
    if (name === "quest") {
      // Assuming quests is an array of quest objects
      const quest = quests.find((el) => el.id === value);

      setSelectedQuest(quest);

      if (isPackage === false) {
        // Customize visibility of form items based on the selected quest
        switch (quest.name) {
          case "ДСР":
            setNotVisibleFormItems([""]);
            break;
          case "У57":
            setNotVisibleFormItems([""]);
            break;
          case "Тьма":
            setNotVisibleFormItems(["actor_second_actor"]);
            break;
          case "ДМ":
            setNotVisibleFormItems(["animator"]);
            break;
          // Add more cases as needed
          default:
            setNotVisibleFormItems([]);
            break;
        }

        // Customize form items based on the quest's address
        if (quest.address === "Афанасьева, 13") {
          setNotVisibleFormItems(["photomagnets_quantity"]);
        }
      }

      // Customize default form values based on whether it's a weekend or weekday
      if (isWeekend === true) {
        setDefaultValuesFormItems({
          quest_cost: quest.cost_weekends,
          // Set other default values as needed
        });
      } else if (isWeekend === false) {
        setDefaultValuesFormItems({
          quest_cost: quest.cost_weekdays,
          // Set other default values as needed
        });
      }
    } else if (name === "package") {
      // Handle changes in the 'package' checkbox
      setIsPackage(value.target.checked);

      if (value.target.checked) {
        // Customize notVisibleFormItems when 'package' is checked
        const names = stquestsFormItems.reduce((accumulator, currentGroup) => {
          currentGroup.items.forEach((item) => {
            accumulator.push(item.name);
          });
          return accumulator;
        }, []);
        const visibleNames = [
          "quest",
          "package",
          "video_review",
          "date",
          "time",
          "quest_cost",
          "administrator",
        ];
        const filteredArray = names.filter(
          (item) => !visibleNames.includes(item)
        );
        setNotVisibleFormItems(filteredArray);
      } else {
        // Reset notVisibleFormItems when 'package' is unchecked
        setNotVisibleFormItems([]);
      }
    } else if (name === "date") {
      // Handle changes in the 'date' field
      const selectedDate = new Date(value);
      const dayOfWeek = selectedDate.getDay();
      if (Object.keys(selectedQuest).length !== 0) {
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          setIsWeekend(true);
          setDefaultValuesFormItems({
            quest_cost: selectedQuest.cost_weekends,
            // Set other default values as needed
          });
        } else {
          setIsWeekend(false);
          setDefaultValuesFormItems({
            quest_cost: selectedQuest.cost_weekdays,
            // Set other default values as needed
          });
        }
      }
    }
  };

  const fetchQuests = async () => {
    try {
      const response = await getQuests();
      if (response.status === 200) {
        setQuests(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, []);

  return {
    quests,
    setQuests,
    selectedQuest,
    setSelectedQuest,
    isPackage,
    setIsPackage,
    isWeekend,
    setIsWeekend,
    notVisibleFormItems,
    setNotVisibleFormItems,
    defaultValuesFormItems,
    setDefaultValuesFormItems,
    formHandleOnChange,
  };
};

export default useQuestForm;
