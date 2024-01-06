import {
  Button,
  Container,
  Text,
  Title,
  Modal,
  TextInput,
  Group,
  Card,
  ActionIcon,
} from "@mantine/core";

import { useState, useEffect } from "react";
import { MoonStars, Sun } from "tabler-icons-react";
import Axios from "axios";
import { MantineProvider, ColorSchemeProvider } from "@mantine/core";

import { useHotkeys, useLocalStorage } from "@mantine/hooks";

export default function App() {
  const [celebrants, setCelebrants] = useState([]);
  const [opened, setOpened] = useState(false);
  const [name, setCelebrant] = useState("");
  const [birthdayDate, setBirthdayDate] = useState("");
  const [colorScheme, setColorScheme] = useLocalStorage({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  const handleNameChange = (e) => {
    setCelebrant(e.target.value);
  };
  const handleDateChange = (e) => {
    setBirthdayDate(e.target.value);
  };
  
  const handleAddCelebrant = async (e) => {
    e.preventDefault();

    const celebrantData = {
      name: name,
      birthdayDate: birthdayDate,
    };

    try {
      const response = await Axios.post("http://localhost:8000/postCelebrant", celebrantData);

      if (response.status === 200) {
        console.log(response.data);
        // Update celebrants state with the new celebrant data if needed
        setCelebrants([...celebrants, response.data]);
      } else {
        console.error("Failed to add celebrant");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    Axios.get("http://localhost:8000/getCelebrants")
      .then((response) => {
        setCelebrants(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  return (
   <ColorSchemeProvider
   colorScheme ={colorScheme}
   toggleColorScheme={toggleColorScheme}
   >
      <MantineProvider
        theme={{ colorScheme, defaultRadius: "md" }}
        withGlobalStyles
        withNormalizeCSS
      >
        <div className="App">
          <Modal
            opened={opened}
            size={"md"}
            title={"New Celebrant"}
            withCloseButton={false}
            onClose={() => {
              setOpened(false);
            }}
            centered
          >
            <form onSubmit={handleAddCelebrant}>
              <TextInput
                mt={"md"}
                value={setCelebrant}
                placeholder={"Celebrant's name"}
                required
                onChange={handleNameChange}
                label={"Name"}
              />
              <label>Date</label><br/>
              <input
                type="date"
                value={setBirthdayDate}
                mt={"md"}
                placeholder={"Task Summary"}
                required
                onChange={handleDateChange}
                label={"Summary"}
              />
              <Group mt={"md"} position={"apart"}>
                <Button
                  onClick={() => {
                    setOpened(false);
                  }}
                  variant={"subtle"}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Celebrant</Button>
              </Group>
            </form>
          </Modal>
          <Container size={550} my={40}>
            <Group position={"apart"}>
              <Title
                sx={(theme) => ({
                  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                  fontWeight: 900,
                })}
              >
                Birthdays
              </Title>
              <ActionIcon
                color={"blue"}
                onClick={() => toggleColorScheme()}
                size="lg"
              >
                {colorScheme === "dark" ? (
                  <Sun size={16} />
                ) : (
                  <MoonStars size={16} />
                )}
              </ActionIcon>
            </Group>
            {celebrants.length > 0 ? (
  celebrants.map((celebrant, index) => {
    if (celebrant.name) {
      return (
        <Card withBorder key={index} mt={"sm"}>
          <Group position={"apart"}>
            <Text weight={"bold"}>{celebrant.name}</Text>
          </Group>
          <Text color={"dimmed"} size={"md"} mt={"sm"}>
            {celebrant.formattedBirthdayDate
              ? celebrant.formattedBirthdayDate
              : "Date not provided"}
          </Text>
        </Card>
      );
    } else {
      return null; // Explicitly return null for falsy celebrant.name
    }
  })
) : (
  <Text size={"lg"} mt={"md"} color={"dimmed"}>
    No Birthdays Available
  </Text>
)}

            <Button
              onClick={() => {
                setOpened(true);
              }}
              fullWidth
              mt={"md"}
            >
              New Celebrant
            </Button>
          </Container>
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
