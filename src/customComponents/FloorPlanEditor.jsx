import React from 'react'

import {
  useInput,
  useNotify,
} from 'react-admin'

import {
  Box,
  Button,
  Typography,
  IconButton,
  TextField,
} from '@mui/material'

import DeleteIcon from '@mui/icons-material/Delete'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

import {
  useFormContext,
  useWatch,
} from 'react-hook-form'

const BASE =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8000'


export default function FloorPlanEditor() {
  const notify = useNotify()

  const { setValue, control } = useFormContext()

  const {
    field,
  } = useInput({
    source: 'floor_plan_booths',
    defaultValue: [],
  })

  const booths = field.value || []

  const existingFloorPlanUrl = useWatch({
    control,
    name: 'floor_plan_url',
  })

  const [imageUrl, setImageUrl] =
    React.useState(null)

  const [drawing, setDrawing] =
    React.useState(false)

  const [startPoint, setStartPoint] =
    React.useState(null)

  const [currentRect, setCurrentRect] =
    React.useState(null)

  const [uploading, setUploading] =
    React.useState(false)

  const imageContainerRef =
    React.useRef(null)


  /*
   * Load existing floor plan when editing.
   */
  React.useEffect(() => {
    if (!existingFloorPlanUrl) {
      setImageUrl(null)
      return
    }

    setImageUrl(
      existingFloorPlanUrl.startsWith('http')
        ? existingFloorPlanUrl
        : `${BASE}${existingFloorPlanUrl}`
    )
  }, [existingFloorPlanUrl])


  /*
   * Upload floor plan.
   */
  const handleUpload = async (event) => {
    const file =
      event.target.files?.[0]

    if (!file) {
      return
    }

    const formData =
      new FormData()

    formData.append(
      'file',
      file
    )

    try {
      setUploading(true)

      const response =
        await fetch(
          `${BASE}/floor-plans/upload`,
          {
            method: 'POST',
            body: formData,
          }
        )

      if (!response.ok) {
        throw new Error(
          await response.text()
        )
      }

      const data =
        await response.json()

      const url =
        data.url.startsWith('http')
          ? data.url
          : `${BASE}${data.url}`

      setImageUrl(url)

      /*
       * Save URL into React Admin form.
       */
      setValue(
        'floor_plan_url',
        data.url,
        {
          shouldDirty: true,
          shouldTouch: true,
        }
      )

      /*
       * New floor plan means new booth
       * coordinates should start empty.
       */
      setValue(
        'floor_plan_booths',
        [],
        {
          shouldDirty: true,
          shouldTouch: true,
        }
      )

      notify(
        'Floor plan uploaded',
        {
          type: 'success',
        }
      )

    } catch (error) {
      console.error(error)

      notify(
        'Failed to upload floor plan',
        {
          type: 'error',
        }
      )

    } finally {
      setUploading(false)

      /*
       * Allow selecting the same file again.
       */
      event.target.value = ''
    }
  }


  /*
   * Get mouse position relative to floor plan.
   */
  const getPosition = (event) => {
    const container =
      imageContainerRef.current

    if (!container) {
      return {
        x: 0,
        y: 0,
      }
    }

    const rect =
      container.getBoundingClientRect()

    return {
      x:
        event.clientX -
        rect.left,

      y:
        event.clientY -
        rect.top,
    }
  }


  /*
   * Start drawing booth rectangle.
   */
  const handleMouseDown = (event) => {
    if (!imageUrl) {
      return
    }

    /*
     * Only react to left mouse button.
     */
    if (event.button !== 0) {
      return
    }

    event.preventDefault()

    const point =
      getPosition(event)

    setDrawing(true)

    setStartPoint(point)

    setCurrentRect({
      x: point.x,
      y: point.y,
      width: 0,
      height: 0,
    })
  }


  /*
   * Resize rectangle while dragging.
   */
  const handleMouseMove = (event) => {
    if (
      !drawing ||
      !startPoint
    ) {
      return
    }

    const point =
      getPosition(event)

    const x =
      Math.min(
        startPoint.x,
        point.x
      )

    const y =
      Math.min(
        startPoint.y,
        point.y
      )

    const width =
      Math.abs(
        point.x -
        startPoint.x
      )

    const height =
      Math.abs(
        point.y -
        startPoint.y
      )

    setCurrentRect({
      x,
      y,
      width,
      height,
    })
  }


  /*
   * Finish drawing booth.
   */
  const handleMouseUp = () => {
    if (
      !drawing ||
      !currentRect ||
      !imageContainerRef.current
    ) {
      return
    }

    const container =
      imageContainerRef.current
        .getBoundingClientRect()

    /*
     * Ignore very small rectangles.
     */
    if (
      currentRect.width < 10 ||
      currentRect.height < 10
    ) {
      setDrawing(false)
      setStartPoint(null)
      setCurrentRect(null)
      return
    }

    /*
     * Store coordinates as percentages.
     *
     * This is important because the image can
     * resize on different screen sizes.
     */
    const booth = {
      id:
        crypto.randomUUID(),

      name:
        `Booth ${booths.length + 1}`,

      x:
        (currentRect.x /
          container.width) *
        100,

      y:
        (currentRect.y /
          container.height) *
        100,

      width:
        (currentRect.width /
          container.width) *
        100,

      height:
        (currentRect.height /
          container.height) *
        100,
    }

    setValue(
      'floor_plan_booths',
      [
        ...booths,
        booth,
      ],
      {
        shouldDirty: true,
        shouldTouch: true,
      }
    )

    setDrawing(false)
    setStartPoint(null)
    setCurrentRect(null)
  }


  /*
   * Finish drawing if mouse leaves the image.
   */
  const handleMouseLeave = () => {
    if (!drawing) {
      return
    }

    handleMouseUp()
  }


  /*
   * Delete booth.
   */
  const removeBooth = (id) => {
    setValue(
      'floor_plan_booths',
      booths.filter(
        booth =>
          booth.id !== id
      ),
      {
        shouldDirty: true,
        shouldTouch: true,
      }
    )
  }


  /*
   * Rename booth.
   */
  const renameBooth = (
    id,
    name
  ) => {
    setValue(
      'floor_plan_booths',
      booths.map(
        booth =>
          booth.id === id
            ? {
                ...booth,
                name,
              }
            : booth
      ),
      {
        shouldDirty: true,
        shouldTouch: true,
      }
    )
  }


  return (
    <Box sx={{ width: '100%' }}>

      <Typography
        sx={{
          fontWeight: 600,
          fontSize: 16,
          mb: 0.5,
        }}
      >
        Floor Plan
      </Typography>

      <Typography
        sx={{
          fontSize: 13,
          color: 'text.secondary',
          mb: 2,
        }}
      >
        Upload the conference floor plan,
        then drag over areas to create booth
        locations.
      </Typography>


      {/* UPLOAD */}

      <Button
        component="label"
        variant="outlined"
        startIcon={
          <CloudUploadIcon />
        }
        disabled={uploading}
        sx={{ mb: 2 }}
      >
        {uploading
          ? 'Uploading...'
          : 'Upload Floor Plan'}

        <input
          hidden
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleUpload}
        />
      </Button>


      {/* FLOOR PLAN */}

      {imageUrl && (

        <Box
          sx={{
            width: '100%',
            maxWidth: 1200,
          }}
        >

          <Box
            ref={imageContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            sx={{
              position: 'relative',
              width: '100%',
              cursor: 'crosshair',
              userSelect: 'none',
              overflow: 'hidden',
              lineHeight: 0,
            }}
          >

            <img
              src={imageUrl}
              alt="Conference floor plan"
              draggable={false}
              style={{
                display: 'block',
                width: '100%',
                height: 'auto',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />


            {/* EXISTING BOOTHS */}

            {booths.map(
              (booth) => (

                <Box
                  key={booth.id}
                  sx={{
                    position: 'absolute',

                    left:
                      `${booth.x}%`,

                    top:
                      `${booth.y}%`,

                    width:
                      `${booth.width}%`,

                    height:
                      `${booth.height}%`,

                    border:
                      '2px solid',

                    borderColor:
                      'primary.main',

                    backgroundColor:
                      'rgba(25, 118, 210, 0.20)',

                    boxSizing:
                      'border-box',

                    pointerEvents:
                      'none',

                    overflow: 'hidden',
                  }}
                >

                  <Typography
                    sx={{
                      fontSize: 12,
                      lineHeight: 1.2,
                      fontWeight: 600,
                      px: 0.5,
                      py: 0.25,
                      backgroundColor:
                        'rgba(255,255,255,0.85)',
                      display:
                        'inline-block',
                    }}
                  >
                    {booth.name}
                  </Typography>

                </Box>

              )
            )}


            {/* CURRENT RECTANGLE */}

            {currentRect && (

              <Box
                sx={{
                  position: 'absolute',

                  left:
                    currentRect.x,

                  top:
                    currentRect.y,

                  width:
                    currentRect.width,

                  height:
                    currentRect.height,

                  border:
                    '2px dashed',

                  borderColor:
                    'secondary.main',

                  backgroundColor:
                    'rgba(156, 39, 176, 0.15)',

                  pointerEvents:
                    'none',

                  boxSizing:
                    'border-box',
                }}
              />

            )}

          </Box>


          {/* BOOTH LIST */}

          {booths.length > 0 && (

            <Box sx={{ mt: 2 }}>

              <Typography
                sx={{
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Booths ({booths.length})
              </Typography>


              {booths.map(
                (booth) => (

                  <Box
                    key={booth.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1,
                    }}
                  >

                    <TextField
                      size="small"
                      value={
                        booth.name || ''
                      }
                      onChange={(event) =>
                        renameBooth(
                          booth.id,
                          event.target.value
                        )
                      }
                      label="Booth name"
                    />

                    <IconButton
                      color="error"
                      onClick={() =>
                        removeBooth(
                          booth.id
                        )
                      }
                    >
                      <DeleteIcon />
                    </IconButton>

                  </Box>

                )
              )}

            </Box>

          )}

        </Box>

      )}

    </Box>
  )
}