import * as React from "react";
const { useState, useMemo } = React;

import {
  Paper,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Divider,
  IconButton,
  Typography,
  MenuItem,
  Select,
  FormControlLabel,
  Switch
} from "@material-ui/core";
import DownloadIcon from "@material-ui/icons/ArrowDownward";
import PlayIcon from "@material-ui/icons/PlayArrow";

import AudioPlayer from "./AudioPlayer";

import useAudio from "../hooks/useAudio";

import { ProductFile } from "../../domains/Product";

import { formatFileSize } from "../../utils/format";
import {
  downloadFromFirebaseStorage,
  getStorageObjectDownloadUrl
} from "../../utils/network";

interface PlayableOnlySwitchProps {
  playableOnly: boolean;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
}

const PlayableOnlySwitch: React.FC<PlayableOnlySwitchProps> = ({
  playableOnly,
  onChange
}) => {
  return (
    <FormControlLabel
      label="ブラウザで再生可能なファイルのみ表示"
      labelPlacement="start"
      control={<Switch checked={playableOnly} onChange={onChange} />}
    />
  );
};

type SortType = "none" | "contentType" | "size";

interface SortSelectorProps {
  type: SortType;
  onChange: (e: React.ChangeEvent<{ name?: string; value: SortType }>) => void;
}

const SortSelector: React.FC<SortSelectorProps> = ({ type, onChange }) => {
  return (
    <FormControlLabel
      label={"並べ替え"}
      labelPlacement="start"
      control={
        <Select value={type} onChange={onChange}>
          <MenuItem value="none">なし</MenuItem>
          <MenuItem value="contentType">ファイル形式</MenuItem>
          <MenuItem value="size">ファイルサイズ</MenuItem>
        </Select>
      }
    />
  );
};

interface ListItemData {
  id: string;
  name: string;
  contentType: string;
  size: string;
  canPlay: boolean;
}

interface InnerListProps {
  data: ListItemData[];
  onStart: (id: string) => Promise<void>;
  onDownload: (id: string) => void;
}

const InnerList: React.FC<InnerListProps> = ({ data, onStart, onDownload }) => {
  const onPlayIconClicked = (id: string) => (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    onStart(id);
  };

  const onDownloadIconClicked = (id: string) => (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    onDownload(id);
  };

  return (
    <List>
      {data.map(({ id, name, contentType, size, canPlay }) => (
        <React.Fragment key={id}>
          <ListItem>
            <ListItemText
              primary={name}
              secondary={<Typography>{`${contentType}: ${size}`}</Typography>}
            />
            <ListItemSecondaryAction>
              <IconButton edge="start" onClick={onDownloadIconClicked(id)}>
                <DownloadIcon />
              </IconButton>
              {canPlay && (
                <IconButton edge="end" onClick={onPlayIconClicked(id)}>
                  <PlayIcon />
                </IconButton>
              )}
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );
};

interface ProductFileDownloaderTableProps {
  files: { [id: string]: ProductFile };
}
const ProductFileDownloaderTable: React.FC<ProductFileDownloaderTableProps> = ({
  files
}) => {
  const data = Object.keys(files).map(id => {
    const productFile = files[id];
    return {
      id,
      name: productFile.displayName,
      contentType: productFile.contentType,
      size: formatFileSize(productFile.size),
      // TODO!
      canPlay: ["audio/mp3", "audio/x-m4a"].includes(productFile.contentType)
    };
  });

  const [playableOnly, setPlayableOnly] = useState(false);
  const [sortType, setSortType] = useState<SortType>("none");
  const {
    play,
    pause,
    release,
    changeTime,
    state,
    currentTime,
    duration
  } = useAudio();

  const handlePlayableOnly = () => {
    setPlayableOnly(!playableOnly);
  };

  const handleSortType = (
    e: React.ChangeEvent<{ name?: string; value: SortType }>
  ) => {
    setSortType(e.target.value);
  };

  const onDownloadClicked = (id: string) => {
    const { storageUrl, originalName } = files[id];
    downloadFromFirebaseStorage(storageUrl, originalName);
  };

  const onStartWithList = async (id: string) => {
    const { storageUrl } = files[id];

    const url = await getStorageObjectDownloadUrl(storageUrl);
    await play(url);
  };

  const onStartWithPlayer = async () => {
    await play();
  };

  const onClosePlayer = () => {
    release();
  };

  const visibleData = useMemo(() => {
    let d = [...data];

    if (playableOnly) {
      d = d.filter(item => !!item.canPlay);
    }

    const sortWith = (a: string | number, b: string | number) => {
      if (a < b) {
        return -1;
      }
      if (b < a) {
        return 1;
      }
      return 0;
    };

    if (sortType === "contentType") {
      d.sort(({ contentType: a }, { contentType: b }) => sortWith(a, b));
    }

    if (sortType === "size") {
      d.sort(({ size: a }, { size: b }) => sortWith(a, b));
    }

    return d;
  }, [playableOnly, sortType]);

  return (
    <>
      <Paper>
        <Grid container={true} direction="column">
          <Grid item={true}>
            <PlayableOnlySwitch
              playableOnly={playableOnly}
              onChange={handlePlayableOnly}
            />
          </Grid>

          <Grid item={true}>
            <SortSelector type={sortType} onChange={handleSortType} />
          </Grid>

          <Grid item={true}>
            <InnerList
              data={visibleData}
              onStart={onStartWithList}
              onDownload={onDownloadClicked}
            />
          </Grid>
        </Grid>
      </Paper>

      <Drawer anchor="bottom" variant="persistent" open={state !== "none"}>
        <AudioPlayer
          playing={state === "playing"}
          currentSec={currentTime}
          totalSec={duration}
          onClose={onClosePlayer}
          onPlay={onStartWithPlayer}
          onPause={pause}
          onChangeTime={changeTime}
        />
      </Drawer>
    </>
  );
};

export default ProductFileDownloaderTable;
