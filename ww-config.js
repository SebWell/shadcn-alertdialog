export default {
  editor: {
    label: {
      en: 'Alert Dialog',
      fr: 'Dialogue d\'Alerte'
    },
    icon: 'alert-triangle'
  },
  triggerEvents: [
    {
      name: 'confirm',
      label: { en: 'On confirm', fr: 'À la confirmation' },
      event: {
        confirmationValue: '',
        content: {}
      }
    },
    {
      name: 'cancel',
      label: { en: 'On cancel', fr: 'À l\'annulation' },
      event: {
        content: {}
      }
    },
    {
      name: 'update:open',
      label: { en: 'On open change', fr: 'Au changement d\'ouverture' },
      event: {
        open: false
      }
    },
    {
      name: 'close',
      label: { en: 'On close', fr: 'À la fermeture' },
      event: {}
    }
  ],
  properties: {
    variant: {
      label: { en: 'Variant', fr: 'Variante' },
      type: 'TextSelect',
      options: {
        options: [
          { value: 'default', label: { en: 'Default', fr: 'Par défaut' } },
          { value: 'destructive', label: { en: 'Destructive', fr: 'Destructeur' } },
          { value: 'warning', label: { en: 'Warning', fr: 'Avertissement' } },
          { value: 'info', label: { en: 'Info', fr: 'Information' } },
          { value: 'success', label: { en: 'Success', fr: 'Succès' } }
        ]
      },
      defaultValue: 'default',
      bindable: true
    },
    title: {
      label: { en: 'Title', fr: 'Titre' },
      type: 'Text',
      bindable: true
    },
    description: {
      label: { en: 'Description', fr: 'Description' },
      type: 'LongText',
      bindable: true
    },
    content: {
      label: { en: 'Custom content', fr: 'Contenu personnalisé' },
      type: 'LongText',
      bindable: true
    },
    icon: {
      label: { en: 'Custom icon', fr: 'Icône personnalisée' },
      type: 'Icon',
      bindable: true
    },
    confirmLabel: {
      label: { en: 'Confirm button label', fr: 'Label du bouton confirmer' },
      type: 'Text',
      defaultValue: 'Continue',
      bindable: true
    },
    confirmIcon: {
      label: { en: 'Confirm button icon', fr: 'Icône du bouton confirmer' },
      type: 'Icon',
      bindable: true
    },
    cancelLabel: {
      label: { en: 'Cancel button label', fr: 'Label du bouton annuler' },
      type: 'Text',
      defaultValue: 'Cancel',
      bindable: true
    },
    showCancel: {
      label: { en: 'Show cancel button', fr: 'Afficher le bouton annuler' },
      type: 'OnOff',
      defaultValue: true,
      bindable: true
    },
    requireConfirmation: {
      label: { en: 'Require confirmation input', fr: 'Exiger une saisie de confirmation' },
      type: 'OnOff',
      defaultValue: false,
      bindable: true
    },
    confirmationLabel: {
      label: { en: 'Confirmation input label', fr: 'Label de la saisie de confirmation' },
      type: 'Text',
      bindable: true
    },
    confirmationPlaceholder: {
      label: { en: 'Confirmation input placeholder', fr: 'Placeholder de la saisie de confirmation' },
      type: 'Text',
      bindable: true
    },
    confirmationMatch: {
      label: { en: 'Required confirmation text', fr: 'Texte de confirmation requis' },
      type: 'Text',
      bindable: true
    },
    closeOnBackdrop: {
      label: { en: 'Close on backdrop click', fr: 'Fermer au clic sur l\'arrière-plan' },
      type: 'OnOff',
      defaultValue: false,
      bindable: true
    },
    closeOnEscape: {
      label: { en: 'Close on escape', fr: 'Fermer avec Échap' },
      type: 'OnOff',
      defaultValue: true,
      bindable: true
    },
    closeOnConfirm: {
      label: { en: 'Close on confirm', fr: 'Fermer à la confirmation' },
      type: 'OnOff',
      defaultValue: true,
      bindable: true
    },
    actionsClass: {
      label: { en: 'Actions CSS class', fr: 'Classe CSS des actions' },
      type: 'Text',
      bindable: true
    },
    customClass: {
      label: { en: 'Custom CSS class', fr: 'Classe CSS personnalisée' },
      type: 'Text',
      bindable: true
    },
    customStyle: {
      label: { en: 'Custom style', fr: 'Style personnalisé' },
      type: 'Text',
      bindable: true
    }
  }
} 