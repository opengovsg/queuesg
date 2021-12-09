import axios from 'axios';
import { useEffect, useState } from 'react';
import queryString from 'query-string';
import { useRouter } from 'next/router';
import { ExportToCsv } from 'export-to-csv';
import Head from 'next/head';
import moment from 'moment'
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Grid,
  Spinner,
} from '@chakra-ui/react';

import { Container } from '../../components/Container';
import { Main } from '../../components/Main';
import {
  InputCheckbox,
  InputEditable,
  InputText,
  InputTextarea,
  Navbar,
  OpeningHours,
} from '../../components/Admin';
import { authentication } from '../../utils';

const Index = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiConfig, setApiConfig] = useState();
  const [boardData, setBoardData] = useState();
  const [editableSettings, setEditableSettings] = useState();

  /**
   * TODO: move into a separate middleware service
   */
  const errorHandler = (error) => {
    const query = queryString.parse(location.search);

    if (error.response) {
      if (error.response.status === 401) {
        alert(`Your login token is expired. Please login again`);
        router.push(`/admin/login?boardId=${query.boardId}`);
      } else {
        alert(`Error ${error.response.status} : ${error.response.data}`);
      }
    } else {
      console.error(error);
      alert(`Error: ${error.message}`);
    }
  };

  /**
   * Gets the board data from trello directly
   */
  const getBoard = async () => {
    if (apiConfig && apiConfig.key && apiConfig.token && apiConfig.boardId) {
      try {
        const response = await axios.get(
          `https://api.trello.com/1/boards/${apiConfig.boardId}?key=${apiConfig.key}&token=${apiConfig.token}`
        );

        console.log(response.data);
        setEditableSettings(JSON.parse(response.data.desc));
        setBoardData(response.data);
      } catch (error) {
        errorHandler(error);
      }
    }
  };

  /**
   * Updates the board settings
   *
   * Note that there is a 16384 character limit
   */
  const updateBoard = async (type = 'settings', data = null) => {
    if (isSubmitting === true) return;

    if (apiConfig && apiConfig.key && apiConfig.token && apiConfig.boardId) {
      try {
        setIsSubmitting(true);
        const settings = {};

        switch (type) {
          case 'settings':
            const desc = JSON.stringify(editableSettings);
            //  Verify that the board desc does not exceed 16384 characters
            //  https://developer.atlassian.com/cloud/trello/rest/api-group-boards/#api-boards-id-put
            if (desc.length > 16384)
              throw Error(
                'Could not save due to setting JSON length exceeding 16384'
              );
            settings.desc = JSON.stringify(editableSettings);
            break;

          case 'name':
            //  Return if the board name is not changed
            if (boardData.name === data) return;

            //  Update the board name
            if (data) {
              settings.name = String(data);
            } else {
              throw Error(`Board name cannot be empty`);
            }
            break;

          default:
            throw Error(`Wrong type: ${type} provided in updating board`);
        }

        await axios.put(
          `https://api.trello.com/1/boards/${apiConfig.boardId}?key=${apiConfig.key}&token=${apiConfig.token}`,
          settings
        );
      } catch (error) {
        errorHandler(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  /**
   * Effects
   */
  useEffect(() => {
    const query = queryString.parse(location.search);
    const token = authentication.getToken();
    const key = authentication.getKey();

    let boardId =
      query.boardId || prompt('Please enter your queue id', 'E.g. Yg9jAKfn');

    if (token && key) {
      router.push({
        pathname: `/admin`,
        query: {
          boardId,
        },
      });
      setApiConfig({
        token: authentication.getToken(),
        key: authentication.getKey(),
        boardId,
      });
    } else {
      //  redirects the user to the login page
      router.push({
        pathname: `/admin/login`,
        query: {
          boardId,
        },
      });
    }
  }, []);

  useEffect(() => {
    getBoard();
  }, [apiConfig]);

  /**
   * On Categories Change
   */
  const onCategoriesChange = (e) => {
    const categories =
      e.target.value.trim() === '' ? [] : e.target.value.split(',');
    setEditableSettings({
      ...editableSettings,
      [e.target.id]: categories,
    });
  };

  /**
   * On Text Input Change
   */
  const onTextInputChange = (e) => {
    setEditableSettings({
      ...editableSettings,
      [e.target.id]: e.target.value,
    });
  };

  /**
   * On Open Hours Input Change
   */
  const onOpeningHoursInputChange = (openingHours) => {
    setEditableSettings({
      ...editableSettings,
      openingHours,
    });
  };

  /**
   * On Checkbox Input Change
   */
  const onCheckboxInputChange = (id, value) => {
    setEditableSettings({
      ...editableSettings,
      [id]: value,
    });
  };

  /**
   * Generates a report on the Queue
   */
  const assembleCSVData = (batchCardActions, doneCardMap, listsOnBoard) => {
    const extractDataFromCardActions = (cardActions) => {
      let JOINED;
      let name;
      let ticketNumber;
      let cardId;
      let description;
      let labels;
      let members;
      let date;

      let columns = {}
      listsOnBoard.forEach(l => {
        columns[l.name] = null
      })

      cardActions.forEach((action) => {
        const { type, data } = action;
        const actionDate = moment(action.date).utcOffset(8)
        const timestamp = actionDate.format('HH:mm:ss');
        if (type === 'createCard') {
          date = actionDate.format('DD-MM-YYYY')
          JOINED = timestamp;
          cardId = data.card.id;
          const cardInfo = doneCardMap.get(data.card.id);
          description = cardInfo.desc;
          labels = cardInfo.labels.map((lbl) => lbl.name).join(',');
          members = cardInfo.members.map((mbrs) => mbrs.username).join(',');
        } else if (type === 'updateCard') {
          // Only process events with listAfter, this filters out other changes like editing card title
          if (data.listAfter) {
            // Only track existings lists
            if (columns[data.listAfter.name] === null) {
              columns[data.listAfter.name] = timestamp
            }
            if (data.listAfter.name.includes('[DONE]')) {
              ticketNumber = data.card.idShort;
              name = data.card.name.replace(`${ticketNumber}-`, '');
            }
          }
        }
      });
      return {
        name,
        ticketNumber,
        date,
        description,
        labels,
        members,
        JOINED,
        ...columns,
      };
    };

    let dataForExport = [];

    batchCardActions.forEach((card) => {
      if (card['200']) {
        const cardActions = card['200'];
        const row = extractDataFromCardActions(cardActions)

        // If multiple labels, have a row for each
        if (row.labels) {
          const labels = row.labels.split(',')
          labels.forEach(lbl => {
            dataForExport.push({ ...row, labels: lbl })
          })
        } else {
          dataForExport.push(row);
        }
      }
    });
    return dataForExport;
  };
  const exportToCSV = (data) => {
    if (data.length === 0) {
      console.log('No logs found');
    } else {
      const csvExportOptions = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalSeparator: '.',
        showLabels: true,
        showTitle: true,
        title: `Queue Report ${new Date().toString()}`,
        filename: `Queue Report ${new Date().toString()}`,
        useTextFile: false,
        useBom: true,
        useKeysAsHeaders: true,
      };
      const csvExporter = new ExportToCsv(csvExportOptions);
      csvExporter.generateCsv(data);
    }
  };
  const generateReport = async () => {
    try {
      setIsSubmitting(true);
      if (apiConfig && apiConfig.key && apiConfig.token && apiConfig.boardId) {
        // Get list of board to find 'DONE' list id
        const listsOnBoard = (
          await axios.get(
            `https://api.trello.com/1/boards/${apiConfig.boardId}/lists?key=${apiConfig.key}&token=${apiConfig.token}`
          )
        ).data;

        const finalBoard = listsOnBoard.find((list) =>
          list.name.includes('[DONE]')
        );
        if (!finalBoard) throw new Error('No [DONE] list found');

        const listId = finalBoard.id;

        // Get all the card ids on our '[DONE]' list
        const cardsOnList = (
          await axios.get(
            `https://api.trello.com/1/lists/${listId}/cards?members=true&key=${apiConfig.key}&token=${apiConfig.token}`
          )
        ).data;

        const doneCardIds = cardsOnList.map((card) => card.id);
        if (doneCardIds.length === 0) throw new Error('[DONE] list is empty');
        let doneCardMap = new Map();
        cardsOnList.forEach((card) => {
          doneCardMap.set(card.id, card);
        });

        // Batched API call to get histories of all the cards
        const batchUrls = doneCardIds
          .map(
            (id) => `/cards/${id}/actions?filter=createCard%26filter=updateCard`
          )
          .join(',');

        const batchAPICall = await axios.get(
          `https://api.trello.com/1/batch?urls=${batchUrls}&key=${apiConfig.key}&token=${apiConfig.token}`
        );

        const data = assembleCSVData(batchAPICall.data, doneCardMap, listsOnBoard);
        await exportToCSV(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Submits the  form
   *
   * @param {} e
   */
  const submit = async (e) => {
    try {
      e.preventDefault();
      await updateBoard('settings');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Head>
        <title>Admin - QueueUp Sg</title>
      </Head>
      <Container>
        <Navbar />
        <Main justifyContent="start" minHeight="90vh" width="100%">
          <Center>
            {/* TODO: migrate to components for sanity */}
            {boardData ? (
              <Flex width="100%" maxW="1200px" flexDir="column">
                <Flex
                  width="100%"
                  flexDir="row"
                  justifyContent="space-between"
                  alignItems="center"
                  pb="10"
                >
                  <InputEditable
                    color="primary.500"
                    fontSize="xl"
                    isLoading={isSubmitting}
                    onSubmit={(boardName) => updateBoard('name', boardName)}
                    textStyle="heading1"
                    value={boardData.name}
                  />

                  <ButtonGroup>
                    <Button
                      flex
                      colorScheme="blue"
                      borderRadius="3px"
                      color="white"
                      variant="solid"
                      onClick={() => router.push(`/support`)}
                    >
                      Get Links
                    </Button>
                    <Button
                      isLoading={isSubmitting}
                      flex
                      colorScheme="blue"
                      borderRadius="3px"
                      color="white"
                      variant="solid"
                      onClick={generateReport}
                    >
                      Generate Report
                    </Button>
                    <Button
                      flex
                      colorScheme="blue"
                      borderRadius="3px"
                      color="white"
                      variant="solid"
                      onClick={() => window.open(boardData.shortUrl)}
                    >
                      Go To Trello
                    </Button>
                  </ButtonGroup>
                </Flex>

                <Box layerStyle="card" width="100%">
                  <form onSubmit={submit}>
                    <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                      <Box w="100%">
                        {/* registration fields */}
                        <InputCheckbox
                          id="registrationFields"
                          label="Registration Fields"
                          value={editableSettings.registrationFields}
                          onChange={(value) =>
                            onCheckboxInputChange('registrationFields', value)
                          }
                          options={{
                            name: 'Full Name',
                            contact: 'Phone Number',
                            nric: 'NRIC',
                            postalcode: 'Postal Code',
                            description: 'Description',
                          }}
                        />

                        {/* categories */}
                        <InputTextarea
                          id="categories"
                          label="Categories"
                          type="text"
                          value={editableSettings.categories}
                          onChange={onCategoriesChange}
                        />

                        {/* feedback link */}
                        <InputText
                          id="feedbackLink"
                          label="Feedback Link"
                          type="url"
                          value={editableSettings.feedbackLink}
                          onChange={onTextInputChange}
                        />

                        {/* privacy link */}
                        <InputText
                          id="privacyPolicyLink"
                          label="Privacy Policy Link"
                          type="url"
                          value={editableSettings.privacyPolicyLink}
                          onChange={onTextInputChange}
                        />

                        {/* ticket prefix */}
                        <InputText
                          id="ticketPrefix"
                          label="Ticket Prefix"
                          type="text"
                          value={editableSettings.ticketPrefix}
                          onChange={onTextInputChange}
                        />

                        {/* Submit */}
                        <Button
                          isLoading={isSubmitting}
                          loadingText="Updating..."
                          colorScheme="primary"
                          borderRadius="3px"
                          color="white"
                          size="lg"
                          variant="solid"
                          marginTop="1.5rem"
                          type="submit"
                        >
                          Save Settings
                        </Button>
                      </Box>
                      <Box w="100%">
                        {/* Opening Hours */}
                        <OpeningHours
                          id="openingHours"
                          label="Opening Hours"
                          value={editableSettings.openingHours || {}}
                          onChange={onOpeningHoursInputChange}
                        />
                      </Box>
                    </Grid>
                  </form>
                </Box>
              </Flex>
            ) : (
              <Spinner />
            )}
          </Center>
        </Main>
      </Container>
    </>
  );
};

export default Index;
