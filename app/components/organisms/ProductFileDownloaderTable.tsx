import * as React from "react";
const { useState, useMemo, Fragment } = React;

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
import AudioWaveIcon from "../atoms/AudioWaveIcon";
import LoadingIcon from "../atoms/LoadingIcon";

import useAudio, { PlayerState } from "../hooks/useAudio";

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
  name: string;
  contentType: string;
  size: string;
  canPlay: boolean;
}

interface ProductFileListItemProps extends ListItemData {
  state: PlayerState | null;
  onStart: () => Promise<void>;
  onDownload: () => void;
}

const ProductFileListItem: React.FC<ProductFileListItemProps> = ({
  name,
  contentType,
  size,
  canPlay,
  state,
  onStart,
  onDownload
}) => {
  const onPlayIconClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
    onStart();
  };

  const onDownloadIconClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
    onDownload();
  };

  return (
    <ListItem>
      <ListItemText
        primary={name}
        secondary={<Typography>{`${contentType}: ${size}`}</Typography>}
      />
      <ListItemSecondaryAction>
        {canPlay &&
          (state === "playing" ? (
            <AudioWaveIcon animation={true} />
          ) : state === "loading" ? (
            <LoadingIcon animation={true} />
          ) : (
            <IconButton edge="end" onClick={onPlayIconClicked}>
              <PlayIcon />
            </IconButton>
          ))}
        <IconButton edge="start" onClick={onDownloadIconClicked}>
          <DownloadIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
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
  const [selectedId, setSelectedId] = useState<string | null>(null);
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

  const onDownloadClicked = (id: string) => async () => {
    const { storageUrl, originalName } = files[id];
    await downloadFromFirebaseStorage(storageUrl, originalName);
  };

  const onStartWithList = (id: string) => async () => {
    const { storageUrl } = files[id];

    const url = await getStorageObjectDownloadUrl(storageUrl);
    setSelectedId(id);
    await play(url);
  };

  const onStartWithPlayer = async () => {
    await play();
  };

  const onPauseWithPlayer = () => {
    pause();
  };

  const onClosePlayer = () => {
    release();
    setSelectedId(null);
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
            <List>
              {visibleData.map(({ id, name, contentType, size, canPlay }) => (
                <Fragment key={id}>
                  <ProductFileListItem
                    state={id === selectedId ? state : null}
                    name={name}
                    contentType={contentType}
                    size={size}
                    canPlay={canPlay}
                    onStart={onStartWithList(id)}
                    onDownload={onDownloadClicked(id)}
                  />
                  <Divider />
                </Fragment>
              ))}
            </List>
          </Grid>
        </Grid>
      </Paper>

      <Drawer
        PaperProps={{
          style: {
            // NOTE: Mui#Drawerのdefault valueはautoだけれど、Drawerの上端にSliderを表示、かつ操作ボタンをはみ出して表示するために変更する
            // 不都合がある場合は要検討...
            overflowY: "visible"
          }
        }}
        anchor="bottom"
        variant="persistent"
        open={state !== "none"}
      >
        <AudioPlayer
          state={state}
          currentSec={currentTime}
          totalSec={duration}
          onClose={onClosePlayer}
          onPlay={onStartWithPlayer}
          onPause={onPauseWithPlayer}
          onChangeTime={changeTime}
        />
      </Drawer>
    </>
  );
};

export default ProductFileDownloaderTable;
