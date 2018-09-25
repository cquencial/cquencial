export const expectedResultError = () => {
  const err = new Error('Expected result, got undefined')
  err.name = 'Unexpected result'
  return err
}

export const resultHandler = ({onErr, onRes, notifyErr = true, notifyRes = true, logErr = false, templateInstance, expectRes = true, successTitle, successMessage}) => (err, res) => {
  let _err = err || (expectRes && !res ? expectedResultError() : null)
  if (_err) {

    // log error independently
    if (logErr) {
      console.error(_err)
    }

    // notify about error
    if (notifyErr) {
      $.notify({
        icon: 'fa fa-fw fa-times',
        title: _err.reason || _err.name,
        message: _err.details || _err.message
      }, {
        type: 'danger',
        element: 'body',
        position: null,
        allow_dismiss: true,
        newest_on_top: false,
        showProgressbar: false,
        placement: {
          from: 'top',
          align: 'right'
        },
        offset: 20,
        spacing: 10,
        z_index: 1031,
        timer: 1000,
        url_target: '_blank',
        mouse_over: null,
        animate: {
          enter: 'animated fadeInDown',
          exit: 'animated fadeOutUp'
        },
      })
    }

    // call onErr independently from
    // notification
    if (onErr) {
      onErr.call(templateInstance, _err)
    }
  } else if (notifyRes) {
    $.notify({
      icon: 'fa fa-fw fa-check',
      title: successTitle || 'Action successful',
      message: successMessage || '',
    }, {
      type: 'success',
      element: 'body',
      position: null,
      allow_dismiss: true,
      newest_on_top: false,
      showProgressbar: false,
      placement: {
        from: 'top',
        align: 'right'
      },
      offset: 20,
      spacing: 10,
      z_index: 1031,
      timer: 1000,
      url_target: '_blank',
      mouse_over: null,
      animate: {
        enter: 'animated fadeInDown',
        exit: 'animated fadeOutUp'
      },
    })
  }
}
